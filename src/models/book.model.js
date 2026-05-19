const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    pages: {
      type: Number,
    },

    price: {
      type: Number,
    },

    originalPrice: {
      type: Number,
      default: null,
    },

    badge: {
      type: String,
      default: null,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    // public image
    coverImage: {
      type: String,
      required: true,
    },

    // protected book
    bookFile: {
      type: String,
      required: true,
    },

    bookFilePublicId: {
      type: String,
    },

    isProtected: {
      type: Boolean,
      default: true,
    },

    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }

);
bookSchema.index({
  title: "text",
  author: "text",
  category: "text",
});
module.exports = mongoose.model("Book", bookSchema);