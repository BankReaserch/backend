const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
    },

    category: {
      type: String,
    },

    description: {
      type: String,
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

module.exports = mongoose.model("Book", bookSchema);