const mongoose = require("mongoose");

const qnaSchema =
  new mongoose.Schema(
    {
      category: {
        type: String,
        required: true,
        trim: true,
      },

      priority: {
        type: Number,
        required: true,
        default: 1,
      },

      question: {
        type: String,
        required: true,
        trim: true,
      },

      answer: {
        type: String,
        required: true,
        trim: true,
      },

      isPublished: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

qnaSchema.index({
  category: "text",
  question: "text",
  answer: "text",
});

module.exports =
  mongoose.model(
    "QNA",
    qnaSchema
  );