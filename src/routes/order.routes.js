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
  updateOrderStatusController,
  deleteOrderController,
} = require(
  "../controllers/order.controller"
);

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

// ADMIN GET ALL
router.get(
  "/all",
  authenticate,
  isAdmin,
  getAllOrdersController
);
// UPDATE STATUS
router.patch(
  "/update-status/:id",
  authenticate,
  isAdmin,
  updateOrderStatusController
);

// DELETE ORDER
router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteOrderController
);

module.exports = router;