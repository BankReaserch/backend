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
  createBrokerController,
  getAllBrokersController,
  updateBrokerController,
  deleteBrokerController,
} = require(
  "../controllers/broker.controller"
);

/*
========================================
PUBLIC
========================================
*/

// GET ALL BROKERS
router.get(
  "/all",
  getAllBrokersController
);

/*
========================================
ADMIN
========================================
*/

// CREATE
router.post(
  "/create",
  authenticate,
  isAdmin,
  createBrokerController
);

// UPDATE
router.put(
  "/update/:id",
  authenticate,
  isAdmin,
  updateBrokerController
);

// DELETE
router.delete(
  "/delete/:id",
  authenticate,
  isAdmin,
  deleteBrokerController
);

module.exports =
  router;