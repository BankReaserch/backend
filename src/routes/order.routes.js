// routes/order.routes.js

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
  placeOrderController,
  getAllOrdersController,
  getUserOrdersController,
  cancelUserOrderController,
  deleteOrderController,
  updateOrderStatusController,
} = require(
  "../controllers/order.controller"
);

/*
========================================
USER
========================================
*/

// PLACE ORDER
router.post(
  "/place",
  authenticate,
  placeOrderController
);

// USER ORDERS
router.get(
  "/my-orders",
  authenticate,
  getUserOrdersController
);

// USER CANCEL ORDER
router.patch(
  "/cancel/:id",
  authenticate,
  cancelUserOrderController
);

/*
========================================
ADMIN
========================================
*/

// GET ALL ORDERS
router.get(
  "/all",
  authenticate,
  isAdmin,
  getAllOrdersController
);

// UPDATE ORDER STATUS
router.patch(
  "/status/:id",
  authenticate,
  isAdmin,
  updateOrderStatusController
);

// DELETE ORDER
router.delete(
  "/delete/:id",
  authenticate,
  isAdmin,
  deleteOrderController
);

module.exports =
  router;