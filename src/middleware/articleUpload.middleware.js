// middleware/articleUpload.middleware.js

const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");

/*
========================================
CREATE FOLDERS
========================================
*/

const coverPath =
  path.join(
    __dirname,
    "../uploads/article-covers"
  );

const pdfPath =
  path.join(
    __dirname,
    "../uploads/article-pdfs"
  );

if (
  !fs.existsSync(
    coverPath
  )
) {

  fs.mkdirSync(
    coverPath,
    {
      recursive: true,
    }
  );
}

if (
  !fs.existsSync(
    pdfPath
  )
) {

  fs.mkdirSync(
    pdfPath,
    {
      recursive: true,
    }
  );
}

/*
========================================
STORAGE
========================================
*/

const storage =
  multer.diskStorage({
    destination:
      (
        req,
        file,
        cb
      ) => {

        if (
          file.fieldname ===
          "coverImage"
        ) {

          cb(
            null,
            coverPath
          );

        } else {

          cb(
            null,
            pdfPath
          );
        }
      },

    filename:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          Date.now() +
            path.extname(
              file.originalname
            )
        );
      },
  });

const upload =
  multer({
    storage,
  });

module.exports =
  upload;