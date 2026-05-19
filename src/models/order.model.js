const mongoose =
  require("mongoose");

const orderSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      items: [
        {
          book: {
            type:
              mongoose.Schema
                .Types
                .ObjectId,

            ref: "Book",

            required: true,
          },

          title: String,

          quantity: {
            type: Number,

            default: 1,
          },

          price: Number,
        },
      ],

      totalAmount: {
        type: Number,

        required: true,
      },

      status: {
        type: String,

        enum: [
          "pending",
          "paid",
          "cancelled",
          "completed",
        ],

        default: "pending",
      },

      paymentMethod: {
        type: String,

        default: "manual",
      },

      paymentStatus: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed",
        ],

        default: "pending",
      },

      notes: String,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );