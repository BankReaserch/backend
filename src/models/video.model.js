// models/video.model.js

const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["English", "Hebrew", "Yiddish"],
      default: "English",
    },

    series: {
      type: String,
      default: "",
      // e.g. "5 Minute English Series" | "" (Regular Shiur)
    },

    filename: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
    },

    size: {
      type: Number,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Video",
  videoSchema
);