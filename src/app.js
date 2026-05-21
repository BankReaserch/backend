const express = require("express");

const morgan = require("morgan");

const cors = require("cors");

const cookieParser =
  require("cookie-parser");

const path = require("path");

const app = express();

/*
========================================
ROUTES
========================================
*/

const authRoutes =
  require("./routes/auth.routes");

const audioRoutes =
  require("./routes/audio.routes");

const bookRoutes =
  require("./routes/book.routes");

const orderRoutes =
  require("./routes/order.routes");

const qnaRoutes =
  require("./routes/qna.routes");

/*
========================================
TRUST PROXY
(RENDER / NGINX)
========================================
*/

app.set("trust proxy", 1);

/*
========================================
ALLOWED ORIGINS
========================================
*/

const allowedOrigins = [
  "http://localhost:3000",

  "https://ribiswebsitedemo.netlify.app",
];

/*
========================================
CORS
========================================
*/

app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {

      // POSTMAN / MOBILE / SSR
      if (!origin) {
        return callback(
          null,
          true
        );
      }

      if (
        allowedOrigins.includes(
          origin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          "CORS not allowed"
        )
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/*
========================================
MIDDLEWARE
========================================
*/

app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
========================================
STATIC FILES
========================================
*/

app.use(
  "/storage/covers",
  express.static(
    path.join(
      __dirname,
      "storage/covers"
    )
  )
);

/*
========================================
API ROUTES
========================================
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/audio",
  audioRoutes
);

app.use(
  "/api/order",
  orderRoutes
);

app.use(
  "/api/book",
  bookRoutes
);

app.use(
  "/api/qna",
  qnaRoutes
);

/*
========================================
404 HANDLER
========================================
*/

app.use((req, res) => {

  return res.status(404).json({
    success: false,
    message:
      "Route not found",
  });

});

/*
========================================
GLOBAL ERROR HANDLER
========================================
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "Global Error:",
      error
    );

    return res
      .status(
        error.status || 500
      )
      .json({
        success: false,
        message:
          error.message ||
          "Internal server error",
      });

  }
);

module.exports = app;