// routes/auth.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const authController =
  require(
    "../controllers/auth.controller"
  );

/*
========================================
AUTH
========================================
*/

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/logout",
  authenticate,
  authController.logout
);

/*
========================================
EMAIL
========================================
*/

router.get(
  "/verify-email",
  authController.verifyEmail
);

/*
========================================
USER
========================================
*/

router.get(
  "/me",
  authenticate,
  authController.getMe
);

/*
========================================
ADMIN
========================================
*/

router.post(
  "/verify-otp",
  authController.verifyAdminOtp
);

/*
========================================
PASSWORD
========================================
*/

router.post(
  "/change-password",
  authenticate,
  authController.changePassword
);

module.exports =
  router;