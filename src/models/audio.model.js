const mongoose =
  require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "English",
    },

    series: {
      type: String,
      trim: true,
      default: "",
    },

    filename: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
    },

    size: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Audio",
    audioSchema
  );