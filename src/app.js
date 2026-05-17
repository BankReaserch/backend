const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// routes
const authRoutes = require("./routes/auth.routes");
const audioRoutes = require("./routes/audio.routes");

app.set("trust proxy", 1);

// =========================
// CORS
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "https://ribiswebsitedemo.netlify.app",
];

const corsOptions = {
  origin: function (
    origin,
    callback
  ) {
    if (!origin)
      return callback(
        null,
        true
      );

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
};

app.use(cors(corsOptions));

// =========================
// MIDDLEWARES
// =========================
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =========================
// ROUTES
// =========================
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/audio",
  audioRoutes
);

// =========================
// 404
// =========================
app.use((req, res) => {
  res.status(404).json({
    message:
      "Route not found",
  });
});

// =========================
// ERROR HANDLER
// =========================
app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(error);

    res
      .status(
        error.status || 500
      )
      .json({
        message:
          error.message ||
          "Internal server error",
      });
  }
);

module.exports = app;