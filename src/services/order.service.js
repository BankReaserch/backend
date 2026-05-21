const mongoose =
  require("mongoose");

const Order =
  require("../models/order.model");

const Book =
  require("../models/book.model");

// PLACE ORDER
exports.placeOrderService =
  async (req) => {

    const userId =
      req.user.id;

    const {
      items,
      paymentMethod,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "No order items"
      );
    }

    let totalAmount = 0;

    const formattedItems = [];

    for (const item of items) {

      const book =
        await Book.findById(
          item.book
        );

      if (!book) {
        throw new Error(
          "Book not found"
        );
      }

      totalAmount +=
        Number(book.price) *
        Number(
          item.quantity || 1
        );

      formattedItems.push({
        book: book._id,

        title: book.title,

        quantity:
          item.quantity || 1,

        price: book.price,
      });

    }

    const order =
      await Order.create({
        user: userId,

        items:
          formattedItems,

        totalAmount,

        paymentMethod:
          paymentMethod ||
          "manual",
      });

    return order;
  };

// ADMIN GET ALL ORDERS
exports.getAllOrdersService =
  async () => {

    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.book",
          "title coverImage"
        )
        .sort({
          createdAt: -1,
        });

    return orders;
  };

// USER ORDERS
exports.getUserOrdersService =
  async (req) => {

    const userId =
      req.user.id;

    const orders =
      await Order.find({
        user: userId,
      })
        .populate(
          "items.book",
          "title coverImage"
        )
        .sort({
          createdAt: -1,
        });

    return orders;
  };

  // UPDATE ORDER STATUS
exports.updateOrderStatusService =
  async (
    orderId,
    status
  ) => {

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {

      throw new Error(
        "Invalid order status"
      );
    }

    const order =
      await Order.findByIdAndUpdate(
        orderId,
        {
          status,
        },
        {
          new: true,
        }
      );

    if (!order) {

      throw new Error(
        "Order not found"
      );
    }

    return order;
  };
// USER CANCEL ORDER
exports.cancelUserOrderService =
  async (
    orderId,
    userId
  ) => {

    const order =
      await Order.findOne({
        _id: orderId,
        user: userId,
      });

    if (!order) {

      throw new Error(
        "Order not found"
      );
    }

    // BLOCK AFTER SHIPPING
    if (
      order.status ===
        "shipped" ||
      order.status ===
        "delivered"
    ) {

      throw new Error(
        "Order can no longer be cancelled"
      );
    }

    // ALREADY CANCELLED
    if (
      order.status ===
      "cancelled"
    ) {

      throw new Error(
        "Order already cancelled"
      );
    }

    order.status =
      "cancelled";

    await order.save();

    return order;
  };
// DELETE ORDER
exports.deleteOrderService =
  async (req) => {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new Error(
        "Invalid order ID"
      );
    }

    const order =
      await Order.findById(id);

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    await Order.findByIdAndDelete(
      id
    );

    return true;
  };