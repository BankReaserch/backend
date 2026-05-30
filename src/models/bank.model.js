// models/bank.model.js

const mongoose =
  require("mongoose");

const bankSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        required: true,
      },

      location: {
        type: String,
        required: true,
      },

      status: {
        type: String,

        enum: [
          "Mehudar",
          "Compliant",
          "Conditional",
          "Questionable",
          "Noncompliant",
          "Undetermined",
        ],

        default:
          "Compliant",
      },

      website: {
        type: String,
        trim: true,
      },

      assets: {
        type: String,
        trim: true,
      },

      founded: {
        type: String,
        trim: true,
      },

      lastReviewed: {
        type: Date,
      },

      publicInfo: {
        type: String,
      },

      reportUrl: {
        type: String,
      },

      reportAvailable: {
        type: Boolean,
        default: false,
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Bank",
    bankSchema
  );