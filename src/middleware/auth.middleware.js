const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.authenticate = async (
  req,
  res,
  next
) => {
  try {

    const token =
      req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ VERIFY JWT
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
      );

    // ✅ USER ID
    const userId =
      decoded.sub;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ FETCH USER
    const user =
      await User.findById(userId)
        .select(
          "role tokenVersion isActive"
        )
        .lean();

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ TOKEN VERSION CHECK
    if (
      user.tokenVersion !==
      decoded.tokenVersion
    ) {
      return res.status(401).json({
        message: "Session expired",
      });
    }

    // ✅ ACCOUNT ACTIVE
    if (
      user.role !== "admin" &&
      !user.isActive
    ) {
      return res.status(403).json({
        message:
          "Account inactive",
      });
    }

    // ✅ NORMALIZED USER
    req.user = {
      id: userId,
      role: user.role,
    };

    next();

  } catch (error) {

    console.error(
      "Auth error:",
      error.message
    );

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

exports.isAdmin = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  next();
};