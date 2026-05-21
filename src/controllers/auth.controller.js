// controllers/auth.controller.js

const {
  register,
  verifyEmailService,
  loginService,
  verifyAdminOtpService,
  changePasswordService,
} = require(
  "../services/auth.service"
);

/*
========================================
COOKIE CONFIG
========================================
*/

const COOKIE_OPTIONS = {
  httpOnly: true,

  secure: true,

  sameSite: "none",

  path: "/",

  maxAge:
    1000 *
    60 *
    60 *
    24 *
    7,
};

const sendAuthCookie = (
  res,
  token
) => {

  res.cookie(
    "token",
    token,
    COOKIE_OPTIONS
  );
};

/*
========================================
REGISTER
========================================
*/

exports.register =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await register(
          req.body
        );

      return res
        .status(201)
        .json({
          success: true,
          data: result,
        });

    } catch (error) {
      next(error);
    }
  };

/*
========================================
VERIFY EMAIL
========================================
*/

exports.verifyEmail =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await verifyEmailService(
          req.query.token
        );

      return res
        .status(200)
        .json({
          success: true,
          ...result,
        });

    } catch (error) {
      next(error);
    }
  };

/*
========================================
LOGIN
========================================
*/

exports.login =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await loginService(
          req.body
        );

      if (
        result.requiresOtp
      ) {
        return res
          .status(200)
          .json({
            success: true,
            requiresOtp: true,
            userId:
              result.userId,
          });
      }

      sendAuthCookie(
        res,
        result.token
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Login successful",
          user:
            result.user,
        });

    } catch (error) {
      next(error);
    }
  };

/*
========================================
VERIFY ADMIN OTP
========================================
*/

exports.verifyAdminOtp =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await verifyAdminOtpService(
          req.body
        );

      sendAuthCookie(
        res,
        result.token
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Admin login successful",
          user:
            result.user,
        });

    } catch (error) {
      next(error);
    }
  };

/*
========================================
GET ME
========================================
*/

exports.getMe =
  async (
    req,
    res
  ) => {

    return res
      .status(200)
      .json({
        success: true,

        authenticated: true,

        user: {
          id:
            req.user.id,

          role:
            req.user.role,
        },

        isAdmin:
          req.user
            .role ===
          "admin",
      });
  };

/*
========================================
CHANGE PASSWORD
========================================
*/

exports.changePassword =
  async (
    req,
    res,
    next
  ) => {
    try {

      const result =
        await changePasswordService(
          {
            userId:
              req.user.id,

            ...req.body,
          }
        );

      return res
        .status(200)
        .json({
          success: true,
          ...result,
        });

    } catch (error) {
      next(error);
    }
  };

/*
========================================
LOGOUT
========================================
*/

exports.logout =
  async (
    req,
    res
  ) => {

    res.clearCookie(
      "token",
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      }
    );

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Logged out successfully",
      });
  };