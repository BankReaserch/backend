// services/book.service.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Book = require("../models/book.model");

// ─── Add Book ─────────────────────────────────────────────────────────────────

exports.addBookService = async (req) => {
  const {
    title, author, category, description,
    pages, price, originalPrice, badge, inStock,
  } = req.body;

  const coverImage = req.files?.coverImage?.[0];
  const bookFile   = req.files?.bookFile?.[0];

  if (!title)       throw new Error("Book title required");
  if (!coverImage)  throw new Error("Cover image required");
  if (!bookFile)    throw new Error("Book file required");

  const newBook = await Book.create({
    title,
    author,
    category,
    description,
    pages:         pages         ? Number(pages)         : null,
    price:         price         ? Number(price)         : 0,
    originalPrice: originalPrice ? Number(originalPrice) : null,
    badge,
    inStock: inStock !== "false",

    // Always store as a clean URL-path starting with /
    coverImage: `/storage/covers/${coverImage.filename}`,
    bookFile:   `/storage/books/${bookFile.filename}`,

    originalBookName: bookFile.originalname,
    mimeType:         bookFile.mimetype,
    fileSize:         bookFile.size,
    isProtected:      true,
  });

  return newBook;
};

// ─── Get Books ────────────────────────────────────────────────────────────────

exports.getBooksService = async (req) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title:  { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const books = await Book.find(query)
    .select("-bookFile -allowedUsers")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Book.countDocuments(query);

  return {
    books,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ─── Download Book ────────────────────────────────────────────────────────────

exports.downloadBookService = async (req) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  // TODO: Add purchase / plan validation here
  const allowed = true;
  if (!allowed) throw new Error("You don't have access");

  const fullPath = path.join(process.cwd(), book.bookFile);

  return { path: fullPath, name: book.originalBookName };
};

// ─── Update Book ──────────────────────────────────────────────────────────────

exports.updateBookService = async (req) => {
  const { id } = req.params;

  const existingBook = await Book.findById(id);
  if (!existingBook) throw new Error("Book not found");

  const updateData = { ...req.body };

  // Use .filename (not .path) so the stored value is always a clean URL-path,
  // consistent with how addBookService saves it.
  if (req.files?.coverImage?.[0]) {
    updateData.coverImage = `/storage/covers/${req.files.coverImage[0].filename}`;
  }

  if (req.files?.bookFile?.[0]) {
    updateData.bookFile          = `/storage/books/${req.files.bookFile[0].filename}`;
    updateData.originalBookName  = req.files.bookFile[0].originalname;
  }

  const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
  return updatedBook;
};

// ─── Get Single Book ──────────────────────────────────────────────────────────

exports.getSingleBookService = async (req) => {
  const { id } = req.params;

  const book = await Book.findById(id).select("-bookFile -allowedUsers");
  if (!book) throw new Error("Book not found");

  return book;
};

// ─── Delete Book ──────────────────────────────────────────────────────────────

exports.deleteBookService = async (req) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid book ID");

  const book = await Book.findById(id);
  if (!book) throw new Error("Book not found");

  if (book.coverImage) {
    const coverPath = path.join(process.cwd(), book.coverImage);
    if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
  }

  if (book.bookFile) {
    const filePath = path.join(process.cwd(), book.bookFile);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await Book.findByIdAndDelete(id);
  return { success: true };
};

// ─── Related Books ────────────────────────────────────────────────────────────

exports.getRelatedBooksService = async (req) => {
  const { category, id } = req.params;

  const books = await Book.find({ category, _id: { $ne: id } }).limit(4);
  return books;
};