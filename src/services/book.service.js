// services/book.service.js

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

    // SAVE BOOK
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
            ? Number(originalPrice)
            : null,

        badge,

        inStock:
          inStock === "true",

        // PUBLIC
        coverImage:
          coverImage.path.replace(
            /\\/g,
            "/"
          ),

        // PRIVATE
        bookFile:
          bookFile.path.replace(
            /\\/g,
            "/"
          ),

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


// GET BOOKS
exports.getBooksService =
  async () => {

    const books =
      await Book.find()
        .select(
          "-bookFile -allowedUsers"
        )
        .sort({
          createdAt: -1,
        });

    return books;
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
    // Replace with purchase logic

    const allowed =
      true;

    if (!allowed) {
      throw new Error(
        "You don't have access"
      );
    }

    return {
      path: book.bookFile,
      name:
        book.originalBookName,
    };
  };