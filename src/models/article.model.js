// models/article.model.js

const mongoose =
  require("mongoose");

const articleSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      excerpt: {
        type: String,
        required: true,
      },

      category: {
        type: String,
        required: true,
      },

      author: {
        type: String,
        required: true,
      },

      readTime: {
        type: String,
        required: true,
      },

      coverImage: {
        type: String,
      },

      pdfUrl: {
        type: String,
        required: true,
      },

      createdBy: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Article",
    articleSchema
  );