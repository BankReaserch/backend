// middleware/bookUpload.js

const multer = require("multer");
const fs = require("fs");
const path = require("path");

// ABSOLUTE PATHS
const coverPath = path.join(
  __dirname,
  "../../storage/covers"
);

const bookPath = path.join(
  __dirname,
  "../../storage/books"
);

// CREATE FOLDERS
[coverPath, bookPath].forEach(
  (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }
  }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (
      file.fieldname === "coverImage"
    ) {
      cb(null, coverPath);

    } else if (
      file.fieldname === "bookFile"
    ) {
      cb(null, bookPath);

    } else {
      cb(
        new Error(
          "Invalid file field"
        )
      );
    }
  },

  filename: (req, file, cb) => {

    const uniqueName = `${Date.now()}-${file.originalname.replace(
      /\s+/g,
      "-"
    )}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (
  req,
  file,
  cb
) => {

  // COVER IMAGE
  if (
    file.fieldname === "coverImage"
  ) {

    const allowed =
      file.mimetype.startsWith(
        "image/"
      );

    if (!allowed) {
      return cb(
        new Error(
          "Only image files allowed for cover"
        )
      );
    }
  }

  // BOOK FILE
  if (
    file.fieldname === "bookFile"
  ) {

    const allowedMimeTypes = [
      "application/pdf",
      "application/epub+zip",
      "application/zip",
    ];

    if (
      !allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Invalid book file type"
        )
      );
    }
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      100 * 1024 * 1024,
  },
});