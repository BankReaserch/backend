const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth.middleware");
const planController = require("../controllers/plan.controller");

// Stripe webhooks must receive the raw body.
// Register this route BEFORE app.use(express.json()) in your app.js/server.js,
// or ensure your server forwards the raw body for this path only.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  planController.handleStripeWebhook
);

// ─── User routes ──────────────────────────────────────────────────────────────
router.post("/checkout", authenticate, planController.createCheckoutSession);
router.get("/verify",   authenticate, planController.verifyPayment);
router.get("/status",   authenticate, planController.getPlanStatus);
router.get("/current",  authenticate, planController.getCurrentPlan);
router.get("/history",  authenticate, planController.getBillingHistory);
router.post("/cancel",  authenticate, planController.cancelSubscription);
router.post("/resume",  authenticate, planController.resumeSubscription);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get("/users", authenticate, isAdmin, planController.getSubscribers);

module.exports = router;