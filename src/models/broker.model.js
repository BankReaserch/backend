const mongoose =
  require("mongoose");

const brokerSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      location: {
        type: String,
        required: true,
        trim: true,
      },

      info: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      website: {
        type: String,
        required: true,
        trim: true,
      },

      mortgageType: {
        type: String,
        enum: [
          "Residential",
          "Commercial",
          "Both",
        ],
        default: "Residential",
      },

      kosherStatus: {
        type: String,
        enum: [
          "Totally Kosher",
          "Offers Kosher Line",
        ],
        default: "Totally Kosher",
      },

      kosherLine: {
        type: String,
        trim: true,
        default: "",
      },

      logoUrl: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Broker",
    brokerSchema
  );