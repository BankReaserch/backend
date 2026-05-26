// models/planPurchase.model.js

const mongoose =
  require("mongoose");

const planPurchaseSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "User",

        required: true,
      },

      stripeSessionId: {
        type: String,
      },

      stripePaymentIntentId:
        {
          type: String,
        },

      amount: {
        type: Number,

        required: true,
      },

      currency: {
        type: String,

        default: "usd",
      },

      status: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed",
        ],

        default:
          "pending",
      },

      unlimitedReports: {
        type: Boolean,

        default: true,
      },

      active: {
        type: Boolean,

        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "PlanPurchase",
    planPurchaseSchema
  );