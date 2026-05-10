const mongoose =
  require("mongoose");

const audioSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      artist: {
        type: String,
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