const {
  placeOrderService,
  getAllOrdersService,
  getUserOrdersService,
  deleteOrderService,
  updateOrderStatusService,
} = require(
  "../services/order.service"
);

// PLACE ORDER
exports.placeOrderController =
  async (req, res) => {

    try {

      const result =
        await placeOrderService(
          req
        );

      return res.status(201).json({
        success: true,

        message:
          "Order placed successfully",

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });

    }
  };

// ADMIN GET ALL
exports.getAllOrdersController =
  async (req, res) => {

    try {

      const result =
        await getAllOrdersService();

      return res.status(200).json({
        success: true,

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });

    }
  };

// USER ORDERS
exports.getUserOrdersController =
  async (req, res) => {

    try {

      const result =
        await getUserOrdersService(
          req
        );

      return res.status(200).json({
        success: true,

        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });

    }
  };
  // UPDATE ORDER STATUS
exports.updateOrderStatusController =
  async (req, res, next) => {

    try {

      const { id } = req.params;

      const { status } =
        req.body;

      const order =
        await updateOrderStatusService(
          id,
          status
        );

      return res.status(200).json({
        success: true,
        message:
          "Order status updated",
        data: order,
      });

    } catch (error) {

      next(error);

    }
  };

// DELETE ORDER
exports.deleteOrderController =
  async (req, res) => {

    try {

      await deleteOrderService(
        req
      );

      return res.status(200).json({
        success: true,

        message:
          "Order deleted",
      });

    } catch (error) {

      return res.status(500).json({
        success: false,

        message:
          error.message,
      });

    }
  };