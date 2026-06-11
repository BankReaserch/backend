const mongoose =
  require("mongoose");

const qnaCategorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      priority: {
        type: Number,
        required: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "QNACategory",
    qnaCategorySchema
  );