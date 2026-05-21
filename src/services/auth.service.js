// services/auth.service.js

const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/*
========================================
CREATE JWT
========================================
*/

const createToken = (
  user,
  expiresIn = "1d"
) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      tokenVersion:
        user.tokenVersion || 0,
    },

    process.env.JWT_SECRET_KEY,

    {
      expiresIn,
      algorithm: "HS256",
    }
  );
};

/*
========================================
REGISTER
========================================
*/

exports.register = async ({
  email,
  password,
}) => {

  if (!email || !password) {
    throw new Error(
      "All fields are required"
    );
  }

  email = email
    .toLowerCase()
    .trim();

  const existingUser =
    await User.findOne({
      email,
    });

  if (
    existingUser &&
    existingUser.isEmailVerified
  ) {
    throw new Error(
      "User already exists"
    );
  }

  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  const hashedToken =
    crypto
      .createHash(
        "sha256"
      )
      .update(token)
      .digest("hex");

  const user =
    await User.create({
      email,
      password,

      isEmailVerified:
        false,

      verificationToken:
        hashedToken,

      verificationTokenExpires:
        Date.now() +
        15 *
          60 *
          1000,
    });

  const verificationLink =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendEmail(
    user.email,
    verificationLink
  );

  return {
    message:
      "Verification email sent",
  };
};

/*
========================================
VERIFY EMAIL
========================================
*/

exports.verifyEmailService =
  async (token) => {

    if (!token) {
      const error =
        new Error(
          "Token is required"
        );

      error.status = 400;

      throw error;
    }

    const hashedToken =
      crypto
        .createHash(
          "sha256"
        )
        .update(token)
        .digest("hex");

    const user =
      await User.findOne({
        verificationToken:
          hashedToken,

        verificationTokenExpires:
          {
            $gt:
              Date.now(),
          },
      });

    if (!user) {
      throw new Error(
        "Invalid or expired token"
      );
    }

    if (
      user.isEmailVerified
    ) {
      throw new Error(
        "User already verified"
      );
    }

    user.isEmailVerified =
      true;

    user.verificationToken =
      undefined;

    user.verificationTokenExpires =
      undefined;

    await user.save();

    return {
      message:
        "Email verified successfully",
    };
  };

/*
========================================
LOGIN
========================================
*/

exports.loginService =
  async ({
    email,
    password,
  }) => {

    if (
      !email ||
      !password
    ) {
      throw new Error(
        "Email and password are required"
      );
    }

    email = email
      .toLowerCase()
      .trim();

    const user =
      await User.findOne({
        email,
      }).select(
        "+password"
      );

    if (!user) {
      throw new Error(
        "Invalid email or password"
      );
    }

    /*
    ACCOUNT LOCK
    */

    if (
      user.lockUntil &&
      user.lockUntil >
        Date.now()
    ) {
      throw new Error(
        "Account temporarily locked"
      );
    }

    /*
    EMAIL VERIFIED
    */

    if (
      !user.isEmailVerified
    ) {
      throw new Error(
        "Please verify your email first"
      );
    }

    /*
    PASSWORD CHECK
    */

    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {

      user.loginAttempts =
        (user.loginAttempts ||
          0) + 1;

      if (
        user.loginAttempts >=
        5
      ) {
        user.lockUntil =
          Date.now() +
          15 *
            60 *
            1000;

        user.loginAttempts =
          0;
      }

      await user.save();

      throw new Error(
        "Invalid email or password"
      );
    }

    /*
    RESET ATTEMPTS
    */

    user.loginAttempts =
      0;

    user.lockUntil =
      undefined;

    await user.save();

    /*
    ADMIN LOGIN
    */

    if (
      user.role ===
      "admin"
    ) {

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      const hashedOtp =
        crypto
          .createHash(
            "sha256"
          )
          .update(otp)
          .digest("hex");

      user.otp =
        hashedOtp;

      user.otpExpires =
        Date.now() +
        5 *
          60 *
          1000;

      await user.save();

      await Promise.all([
        sendEmail(
          user.email,
          `Your OTP is: ${otp}`
        ),

        // sendEmail(
        //   "shlomoyounger1@gmail.com",
        //   `Admin OTP: ${otp}`
        // ),
      ]);

      return {
        requiresOtp: true,
        userId:
          user._id,
      };
    }

    /*
    NORMAL LOGIN
    */

    const token =
      createToken(
        user,
        "1d"
      );

    return {
      token,

      user: {
        id: user._id,
        email:
          user.email,
        role:
          user.role,
      },
    };
  };

/*
========================================
VERIFY ADMIN OTP
========================================
*/

exports.verifyAdminOtpService =
  async ({
    userId,
    otp,
  }) => {

    const user =
      await User.findById(
        userId
      );

    if (
      !user ||
      user.role !==
        "admin"
    ) {
      throw new Error(
        "Unauthorized"
      );
    }

    const hashedOtp =
      crypto
        .createHash(
          "sha256"
        )
        .update(otp)
        .digest("hex");

    if (
      user.otp !==
        hashedOtp ||
      user.otpExpires <
        Date.now()
    ) {
      throw new Error(
        "Invalid or expired OTP"
      );
    }

    user.otp =
      undefined;

    user.otpExpires =
      undefined;

    await user.save();

    const token =
      createToken(
        user,
        "20h"
      );

    return {
      token,

      user: {
        id: user._id,
        email:
          user.email,
        role:
          user.role,
      },
    };
  };

/*
========================================
CHANGE PASSWORD
========================================
*/

exports.changePasswordService =
  async ({
    userId,
    oldPassword,
    newPassword,
  }) => {

    const user =
      await User.findById(
        userId
      ).select(
        "+password"
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const isMatch =
      await user.comparePassword(
        oldPassword
      );

    if (!isMatch) {
      throw new Error(
        "Old password incorrect"
      );
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (
      !strongPasswordRegex.test(
        newPassword
      )
    ) {
      throw new Error(
        "Weak password"
      );
    }

    user.password =
      newPassword;

    user.tokenVersion =
      (user.tokenVersion ||
        0) + 1;

    await user.save();

    return {
      message:
        "Password updated successfully",
    };
  };