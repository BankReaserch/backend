// models/alert.model.js

const mongoose =
  require("mongoose");

const alertSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
      },

      type: {
        type: String,

        enum: [
          "warning",
          "danger",
          "success",
          "info",
        ],

        default:
          "warning",
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      createdBy: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Alert",
    alertSchema
  );