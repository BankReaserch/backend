const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");

const reportPath =
  path.join(
    __dirname,
    "../uploads/reports"
  );

const bankImagePath =
  path.join(
    __dirname,
    "../uploads/bank-images"
  );

if (
  !fs.existsSync(
    reportPath
  )
) {

  fs.mkdirSync(
    reportPath,
    {
      recursive: true,
    }
  );
}

if (
  !fs.existsSync(
    bankImagePath
  )
) {

  fs.mkdirSync(
    bankImagePath,
    {
      recursive: true,
    }
  );
}

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

          return cb(
            null,
            bankImagePath
          );
        }

        cb(
          null,
          reportPath
        );
      },

    filename:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}${path.extname(
            file.originalname
          )}`
        );
      },
  });

const fileFilter =
  (
    req,
    file,
    cb
  ) => {

    if (
      file.fieldname ===
      "report"
    ) {

      if (
        file.mimetype !==
        "application/pdf"
      ) {

        return cb(
          new Error(
            "Only PDF files are allowed"
          )
        );
      }
    }

    if (
      file.fieldname ===
      "coverImage"
    ) {

      if (
        !file.mimetype.startsWith(
          "image/"
        )
      ) {

        return cb(
          new Error(
            "Only image files are allowed"
          )
        );
      }
    }

    cb(
      null,
      true
    );
  };

module.exports =
  multer({
    storage,
    fileFilter,
  });