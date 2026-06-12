const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const planController = require("../controllers/plan.controller");

// Stripe webhooks must receive the raw body — mount BEFORE express.json()
// In your app.js/server.js make sure this route is registered before
// `app.use(express.json())`, or use the raw body trick shown below.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  planController.handleStripeWebhook
);

router.post("/checkout", authenticate, planController.createCheckoutSession);
router.get("/verify",   authenticate, planController.verifyPayment);
router.get("/status",   authenticate, planController.getPlanStatus);

module.exports = router;