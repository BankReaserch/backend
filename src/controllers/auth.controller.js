const {
  register,
  verifyEmailService,
  loginService,
  verifyAdminOtpService,
  changePasswordService,
  resetPasswordService,
  verifyResetOtpService,
  forgotPasswordService
} = require("../services/auth.service");

/*
========================================
COOKIE CONFIG
========================================
*/

const COOKIE_OPTIONS = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",

  path: "/",

  maxAge:
    1000 *
    60 *
    60 *
    24 *
    7, // 7 days
};

/*
========================================
HELPER
========================================
*/

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
        .json(result);

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

      /*
      ADMIN OTP FLOW
      */

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

      /*
      NORMAL USER LOGIN
      */

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

exports.forgotPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      await forgotPasswordService(
        req.body.email
      );

      res.json({
        success: true,
        message:
          "OTP sent successfully",
      });

    } catch (error) {

      next(error);

    }
  };

  exports.verifyResetOtp =
  async (
    req,
    res,
    next
  ) => {

    try {

      const token =
        await verifyResetOtpService(
          req.body
        );

      res.json({
        success: true,
        token,
      });

    } catch (error) {

      next(error);

    }
  };
  exports.resetPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      await resetPasswordService(
        req.body
      );

      res.json({
        success: true,
        message:
          "Password updated successfully",
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

      /*
      FORCE PASSWORD CHANGE
      */

      if (
        result.requirePasswordChange
      ) {

        return res
          .status(200)
          .json({
            success: true,

            requirePasswordChange: true,

            userId:
              result.userId,
          });

      }

      /*
      ADMIN LOGIN
      */

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
          req.body
        );

      return res
        .status(200)
        .json(result);

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET CURRENT USER
========================================
*/

exports.getMe =
  async (
    req,
    res
  ) => {
    try {

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

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          authenticated: false,

          message:
            "Failed to fetch user",
        });

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
              ? "none"
              : "lax",

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

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Logout failed",
        });

    }
  };

