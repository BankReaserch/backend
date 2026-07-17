const mongoose =
  require("mongoose");

const investmentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      provider: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        required: true,
        enum: [
          "All Investments",
          "High Yield Savings",
        ],
        default: "All Investments",
      },

      minimumInvestment: {
        type: String,
      },

      riskLevel: {
        type: String,
        enum: [
          "Low",
          "Moderate",
          "High",
        ],
        default: "Moderate",
      },

      status: {
        type: String,
        enum: [
          "Approved",
          "Under Review",
          "Restricted",
        ],
        default: "Approved",
      },

      website: {
        type: String,
      },

      phoneNumber: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      description: {
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
    "Investment",
    investmentSchema
  );