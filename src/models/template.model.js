const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title must be under 150 characters"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description must be under 500 characters"],
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Image URL is too long"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);