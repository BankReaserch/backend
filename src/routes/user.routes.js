// routes/user.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
  isAdmin,
} = require(
  "../middleware/auth.middleware"
);

const {
  getAllUsersController,
  toggleUserStatusController,
} = require(
  "../controllers/user.controller"
);

/*
========================================
ADMIN USERS
========================================
*/

// GET ALL USERS
router.get(
  "/allusers",
  authenticate,
  isAdmin,
  getAllUsersController
);

// ACTIVATE / DEACTIVATE USER
router.patch(
  "/toggle-status/:id",
  authenticate,
  isAdmin,
  toggleUserStatusController
);

module.exports =
  router;