// routes/book.routes.js

const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/bookUpload");

const {
  addBookController,
  getBooksController,
  downloadBookController,
  updateBookController,
  getSingleBookController,
  deleteBookController,
  getRelatedBooksController,
} = require("../controllers/book.controller");


// GET ALL BOOKS
router.get(
  "/",
  getBooksController
);

// RELATED BOOKS
router.get(
  "/related/:category/:id",
  getRelatedBooksController
);

// DOWNLOAD
router.get(
  "/download/:id",
  downloadBookController
);

// GET SINGLE BOOK
router.get(
  "/:id",
  getSingleBookController
);

// ADD BOOK
router.post(
  "/add",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "bookFile",
      maxCount: 1,
    },
  ]),
  addBookController
);

// UPDATE BOOK
router.put(
  "/:id",
  upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
    {
      name: "bookFile",
      maxCount: 1,
    },
  ]),
  updateBookController
);

// DELETE BOOK
router.delete(
  "/:id",
  deleteBookController
);

module.exports = router;