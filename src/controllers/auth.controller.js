const {
  register,
  verifyEmailService,
  loginService,
  verifyAdminOtpService,
  changePasswordService,
} = require("../services/auth.service");
const User=require('../models/user.model')


// REGISTER
exports.register = async (req, res, next) => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


// VERIFY EMAIL
exports.verifyEmail = async (req, res, next) => {
  try {
    const result = await verifyEmailService(req.query.token);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


// LOGIN (handles both user + admin step1)
exports.login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);

    // 👑 ADMIN STEP 1 → OTP
    if (result.requiresOtp) {
      return res.status(200).json(result);
    }

    // 👤 NORMAL USER LOGIN
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: result.user,
    });

  } catch (err) {
    next(err);
  }
};


// 👑 ADMIN OTP VERIFY (STEP 2)
exports.verifyAdminOtp = async (req, res, next) => {
  try {
    const result = await verifyAdminOtpService(req.body);

    // 🔥 Force password change
    if (result.requirePasswordChange) {
      return res.status(200).json(result);
    }

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict", // always strict for admin
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      message: "Admin login successful",
      user: result.user,
    });

  } catch (err) {
    next(err);
  }
};


// 🔐 CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordService(req.body);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getMe =
  async (req, res) => {

    try {

      return res.status(200).json({
        success: true,

        authenticated: true,

        isAdmin:
          req.user.role ===
          "admin",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        authenticated: false,

        isAdmin: false,
      });
    }
  };

exports.logout =
  async (req, res) => {

    try {

      res.clearCookie(
        "token",
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "strict"
              : "lax",
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Logged out successfully",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Logout failed",
      });
    }
  };