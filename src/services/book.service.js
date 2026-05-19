// services/book.service.js
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Book =
  require("../models/book.model");


// ADD BOOK
exports.addBookService =
  async (req) => {

    const {
      title,
      author,
      category,
      description,
      pages,
      price,
      originalPrice,
      badge,
      inStock,
    } = req.body;

    // FILES
    const coverImage =
      req.files?.coverImage?.[0];

    const bookFile =
      req.files?.bookFile?.[0];

    // VALIDATION
    if (!title) {
      throw new Error(
        "Book title required"
      );
    }

    if (!coverImage) {
      throw new Error(
        "Cover image required"
      );
    }

    if (!bookFile) {
      throw new Error(
        "Book file required"
      );
    }

    // CREATE BOOK
    const newBook =
      await Book.create({

        title,

        author,

        category,

        description,

        pages:
          pages
            ? Number(pages)
            : null,

        price:
          price
            ? Number(price)
            : 0,

        originalPrice:
          originalPrice
            ? Number(
                originalPrice
              )
            : null,

        badge,

        inStock:
          inStock !== "false",

        // PUBLIC IMAGE
        coverImage:
          `/storage/covers/${coverImage.filename}`,

        // PRIVATE FILE
        bookFile:
          `/storage/books/${bookFile.filename}`,

        originalBookName:
          bookFile.originalname,

        mimeType:
          bookFile.mimetype,

        fileSize:
          bookFile.size,

        isProtected: true,

      });

    return newBook;
  };


exports.getBooksService =
  async (req) => {

    const {
      search,
      category,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // SEARCH
    if (search) {

      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ];

    }

    // CATEGORY
    if (
      category &&
      category !== "All"
    ) {

      query.category =
        category;

    }

    const skip =
      (Number(page) - 1) *
      Number(limit);

    const books =
      await Book.find(query)
        .select(
          "-bookFile -allowedUsers"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(Number(limit));

    const total =
      await Book.countDocuments(
        query
      );

    return {
      books,
      total,
      currentPage:
        Number(page),
      totalPages:
        Math.ceil(
          total / limit
        ),
    };
  };


// DOWNLOAD BOOK


exports.downloadBookService =
  async (req) => {

    const { id } = req.params;

    const userId =
      req.user?.id;

    const book =
      await Book.findById(id);

    if (!book) {
      throw new Error(
        "Book not found"
      );
    }

    // TODO:
    // Add purchase validation

    const allowed = true;

    if (!allowed) {
      throw new Error(
        "You don't have access"
      );
    }

    // ABSOLUTE FILE PATH
    const fullPath =
      path.join(
        process.cwd(),
        book.bookFile
      );

    return {
      path: fullPath,
      name:
        book.originalBookName,
    };
  };

  exports.updateBookService =
  async (req) => {

    const { id } = req.params;

    const existingBook =
      await Book.findById(id);

    if (!existingBook) {
      throw new Error(
        "Book not found"
      );
    }

    const updateData = {
      ...req.body,
    };

    // NEW COVER
    if (
      req.files?.coverImage?.[0]
    ) {

      updateData.coverImage =
        req.files.coverImage[0]
          .path.replace(/\\/g, "/");
    }

    // NEW FILE
    if (
      req.files?.bookFile?.[0]
    ) {

      updateData.bookFile =
        req.files.bookFile[0]
          .path.replace(/\\/g, "/");

      updateData.originalBookName =
        req.files.bookFile[0]
          .originalname;
    }

    const updatedBook =
      await Book.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
        }
      );

    return updatedBook;
  };

  // GET SINGLE BOOK
exports.getSingleBookService =
  async (req) => {

    const { id } = req.params;

    const book =
      await Book.findById(id)
        .select(
          "-bookFile -allowedUsers"
        );

    if (!book) {
      throw new Error(
        "Book not found"
      );
    }

    return book;
  };

  // DELETE BOOK


exports.deleteBookService =
  async (req) => {

    const { id } = req.params;

    // VALIDATE OBJECT ID
    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      throw new Error(
        "Invalid book ID"
      );
    }

    // FIND BOOK
    const book =
      await Book.findById(id);

    if (!book) {
      throw new Error(
        "Book not found"
      );
    }

    // DELETE COVER IMAGE
    if (
      book.coverImage &&
      fs.existsSync(
        book.coverImage
      )
    ) {

      fs.unlinkSync(
        book.coverImage
      );

    }

    // DELETE BOOK FILE
    if (
      book.bookFile &&
      fs.existsSync(
        book.bookFile
      )
    ) {

      fs.unlinkSync(
        book.bookFile
      );

    }

    // DELETE DB RECORD
    await Book.findByIdAndDelete(
      id
    );

    return {
      success: true,
    };
  };

  exports.getRelatedBooksService =
  async (req) => {

    const {
      category,
      id,
    } = req.params;

    const books =
      await Book.find({
        category,
        _id: { $ne: id },
      })
        .limit(4);

    return books;
  };