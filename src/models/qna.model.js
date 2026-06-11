const mongoose = require("mongoose");

const qnaSchema =
  new mongoose.Schema(
    {
      category: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "QNACategory",
        required: true,
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
  question: "text",
  answer: "text",
});

qnaSchema.index(
  {
    category: 1,
    priority: 1,
  },
  {
    unique: true,
  }
);
module.exports =
  mongoose.model(
    "QNA",
    qnaSchema
  );