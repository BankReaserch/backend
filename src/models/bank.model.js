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
      },

      assets: {
        type: String,
      },

      founded: {
        type: String,
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
    "Bank",
    bankSchema
  );