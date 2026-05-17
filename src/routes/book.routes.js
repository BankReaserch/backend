// routes/book.routes.js

const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/bookUpload");

const {
  addBookController,
  getBooksController,
  downloadBookController,
} = require("../controllers/book.controller");


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


// GET ALL BOOKS
router.get(
  "/",
  getBooksController
);


// PROTECTED DOWNLOAD
router.get(
  "/download/:id",
  downloadBookController
);

module.exports = router;