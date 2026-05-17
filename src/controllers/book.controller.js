// controllers/book.controller.js

const {
  addBookService,
  getBooksService,
  downloadBookService,
  updateBookService,
} = require("../services/book.service");


// ADD BOOK
exports.addBookController =
  async (req, res) => {
    try {

      const result =
        await addBookService(req);

      return res.status(201).json({
        success: true,
        message:
          "Book uploaded successfully",
        data: result,
      });

    } catch (error) {

      console.error(
        "Add Book Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Error uploading book",
      });
    }
  };


// GET BOOKS
exports.getBooksController =
  async (req, res) => {
    try {

      const books =
        await getBooksService();

      return res.status(200).json({
        success: true,
        data: books,
      });

    } catch (error) {

      console.error(
        "Get Books Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Error fetching books",
      });
    }
  };


// DOWNLOAD BOOK
exports.downloadBookController =
  async (req, res) => {
    try {

      const result =
        await downloadBookService(
          req
        );

      return res.download(
        result.path,
        result.name
      );

    } catch (error) {

      console.error(
        "Download Error:",
        error
      );

      return res.status(403).json({
        success: false,
        message:
          error.message ||
          "Access denied",
      });
    }
  };


  exports.updateBookController =
  async (req, res) => {

    try {

      const result =
        await updateBookService(req);

      return res.status(200).json({
        success: true,
        message:
          "Book updated successfully",
        data: result,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };