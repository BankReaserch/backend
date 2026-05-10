const multer = require("multer");

const fs = require("fs");

// PRIVATE STORAGE
const uploadPath =
  "storage/audio";

// create folder
if (
  !fs.existsSync(uploadPath)
) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({
    destination: (
      req,
      file,
      cb
    ) => {
      cb(null, uploadPath);
    },

    filename: (
      req,
      file,
      cb
    ) => {
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
  const allowed =
    file.mimetype.startsWith(
      "audio/"
    );

  if (!allowed) {
    return cb(
      new Error(
        "Only audio files allowed"
      )
    );
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,

  limits: {
    fileSize:
      50 * 1024 * 1024,
  },
});