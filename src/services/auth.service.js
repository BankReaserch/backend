const User = require('../models/user.model');
const sendEmail = require('../utils/sendEmail')
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.register = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  email = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.isVerified) {
    throw new Error("User already exists");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.create({
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpires: Date.now() + 15 * 60 * 1000, // 15 min
  });

  // send email (raw token, NOT hashed)
  const verificationLink = `${process.env.Frontend_URL}/verify-email?token=${token}`;

  await sendEmail(user.email, verificationLink);

  return { message: "Verification email sent" };
};

exports.verifyEmailService = async (token) => {
  if (!token) {
    const error = new Error("Token is required");
    error.status = 400;
    throw error;
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error("Invalid or expired token");
    error.status = 400;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("User already verified");
    error.status = 400;
    throw error;
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  return { message: "Email verified successfully" };
};

exports.loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Invalid email or password");

  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new Error("Account temporarily locked");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
      user.loginAttempts = 0;
    }

    await user.save();
    throw new Error("Invalid email or password");
  }

  // ✅ reset attempts
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  // 👑 ADMIN FLOW (STEP 1)
  if (user.role === "admin") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // send OTP email
    await sendEmail(user.email, `Your OTP is: ${otp}`);

    return {
      requiresOtp: true,
      userId: user._id,
      message: "OTP sent to email",
    };
  }

  // 👤 NORMAL USER → login directly
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};

exports.verifyAdminOtpService = async ({ userId, otp }) => {
  const crypto = require("crypto");

  const user = await User.findById(userId);

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (
    user.otp !== hashedOtp ||
    user.otpExpires < Date.now()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  // clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();

  // 🔥 force password change
  if (user.mustChangePassword) {
    return {
      requirePasswordChange: true,
      userId: user._id,
    };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "20h" } // shorter for admin
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
exports.changePasswordService = async ({
  userId,
  newPassword,
  oldPassword, // optional (for normal users)
}) => {
  if (!userId || !newPassword) {
    const error = new Error("UserId and new password are required");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  /**
   * =========================
   * 🔐 NORMAL USER FLOW
   * =========================
   */
  if (!user.mustChangePassword) {
    if (!oldPassword) {
      const error = new Error("Old password is required");
      error.status = 400;
      throw error;
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      const error = new Error("Old password is incorrect");
      error.status = 401;
      throw error;
    }
  }

  /**
   * =========================
   * 🔐 PASSWORD STRENGTH CHECK
   * =========================
   */
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!strongPasswordRegex.test(newPassword)) {
    const error = new Error(
      "Password must be 8+ chars with uppercase, lowercase, number & special character"
    );
    error.status = 400;
    throw error;
  }

  /**
   * =========================
   * 🔐 UPDATE PASSWORD
   * =========================
   */
  user.password = newPassword; // ✅ will be hashed by pre-save hook
  user.mustChangePassword = false;

  // optional cleanup
  user.loginAttempts = 0;
  user.lockUntil = undefined;

  await user.save();

  return {
    message: "Password updated successfully",
  };
};