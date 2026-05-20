const express = require("express");
const router = express.Router();
const {authenticate}= require("../middleware/auth.middleware")

const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.get("/me",authenticate,authController.getMe);

router.post("/logout",authController.logout);
// 👑 admin
router.post("/verify-otp", authController.verifyAdminOtp);

// 🔐 password
router.post("/change-password", authController.changePassword);

module.exports = router;