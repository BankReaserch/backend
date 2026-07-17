// middleware/upload.middleware.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// PUBLIC — served by app.js's `express.static` mount on "/uploads".
// __dirname is backend/src/middleware, so ".." + ".." reaches
// backend/, matching articleUpload.middleware.js's (working) pattern.
const bankImagePath = path.join(
  __dirname,
  "../../uploads/bank-images"
);

// PUBLIC — broker logos, served the same way as bank images.
const brokerLogoPath = path.join(
  __dirname,
  "../../uploads/broker-logos"
);

// PROTECTED — never statically mounted. Same convention as
// bookUpload.js's `storage/books`: the only way to read these bytes
// is through an authenticated controller that streams the file.
const reportPath = path.join(
  __dirname,
  "../../storage/reports"
);

if (!fs.existsSync(bankImagePath)) {
  fs.mkdirSync(bankImagePath, {
    recursive: true,
  });
}

if (!fs.existsSync(brokerLogoPath)) {
  fs.mkdirSync(brokerLogoPath, {
    recursive: true,
  });
}

if (!fs.existsSync(reportPath)) {
  fs.mkdirSync(reportPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "coverImage") {
      return cb(null, bankImagePath);
    }

    if (file.fieldname === "logo") {
      return cb(null, brokerLogoPath);
    }

    cb(null, reportPath);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "report") {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }
  }

  if (
    file.fieldname === "coverImage" ||
    file.fieldname === "logo"
  ) {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Only image files are allowed")
      );
    }
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
});