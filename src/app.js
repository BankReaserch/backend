const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const authRoutes       = require("./routes/auth.routes");
const audioRoutes      = require("./routes/audio.routes");
const bookRoutes       = require("./routes/book.routes");
const orderRoutes      = require("./routes/order.routes");
const qnaRoutes        = require("./routes/qna.routes");
const userRoutes       = require("./routes/user.routes");
const bankRoutes       = require("./routes/bank.routes");
const planRoutes       = require("./routes/plan.routes");
const articleRoutes    = require("./routes/article.routes");
const alertRoutes      = require("./routes/alert.routes");
const dashboardRoutes  = require("./routes/dashboard.routes");
const brokerRoutes     = require("./routes/broker.routes");
const contactRoutes    = require("./routes/contact.routes");
const investmentRoutes = require("./routes/investment.routes");
const planController   = require("./controllers/plan.controller");
const subscribeController = require('./routes/subscriber.routes')
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://ribiswebsitedemo.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Stripe webhook — MUST be before express.json() ───────────────────────────
app.post(
  "/api/plan/webhook",
  express.raw({ type: "application/json" }),
  planController.handleStripeWebhook
);

// ── General middleware ────────────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
// app.js lives in backend/src/ so __dirname = backend/src
// storage/ is at backend/storage/ — go up one level with ".."

// Cover images — PUBLIC, loaded directly by <img> tags
app.use("/storage/covers", express.static(path.join(__dirname, "..", "storage", "covers")));

// uploads (article covers, bank images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// NOTE: storage/books and storage/reports are intentionally NOT static-served.
// They are protected and only accessible via authenticated download controllers.

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/audio",       audioRoutes);
app.use("/api/order",       orderRoutes);
app.use("/api/book",        bookRoutes);
app.use("/api/qna",         qnaRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/banks",       bankRoutes);
app.use("/api/plan",        planRoutes);
app.use("/api/articles",    articleRoutes);
app.use("/api/alerts",      alertRoutes);
app.use("/api/dashboard",   dashboardRoutes);
app.use("/api/brokers",     brokerRoutes);
app.use("/api/investments",  investmentRoutes);
app.use("/api/contact",     contactRoutes);
app.use("/api/subscribers",subscribeController)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  return res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((error, req, res, next) => {
  console.error("Global Error:", error);
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

module.exports = app;