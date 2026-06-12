const mongoose =
  require("mongoose");

const qnaSchema =
  new mongoose.Schema(
    {
      category: {
        type: String,
        required: true,
        trim: true,
      },

      categoryPriority: {
        type: Number,
        required: true,
        min: 1,
      },

      priority: {
        type: Number,
        required: true,
        min: 1,
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

qnaSchema.index(
  {
    category: 1,
    priority: 1,
  },
  {
    unique: true,
  }
);

qnaSchema.index(
  {
    category: 1,
    question: 1,
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