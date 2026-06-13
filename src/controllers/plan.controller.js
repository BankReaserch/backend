const {
  createCheckoutSessionService,
  verifyPaymentService,
  getPlanStatusService,
  handleStripeWebhookService,
  getBillingHistoryService,
  cancelSubscriptionService,
  resumeSubscriptionService,
  getSubscribersService,
} = require("../services/plan.service");

// ─── Checkout ────────────────────────────────────────────────────────────────

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { billingType } = req.body;
    const session = await createCheckoutSessionService(req, billingType);
    return res.json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

// ─── Verify Payment (called from /plan/success) ───────────────────────────────

exports.verifyPayment = async (req, res, next) => {
  try {
    const { session_id } = req.query;
    const result = await verifyPaymentService(session_id);
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ─── Plan Status ──────────────────────────────────────────────────────────────

exports.getPlanStatus = async (req, res, next) => {
  try {
    const plan = await getPlanStatusService(req.user.id);
    return res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// Alias used by /current route
exports.getCurrentPlan = async (req, res, next) => {
  try {
    const plan = await getPlanStatusService(req.user.id);
    return res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// ─── Stripe Webhook (NO authenticate middleware on this route) ────────────────

exports.handleStripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const result = await handleStripeWebhookService(req.body, signature);
    return res.json(result);
  } catch (error) {
    // Return 400 so Stripe knows the webhook was rejected and will retry
    return res.status(400).json({ error: error.message });
  }
};

// ─── Billing History ──────────────────────────────────────────────────────────

exports.getBillingHistory = async (req, res, next) => {
  try {
    const history = await getBillingHistoryService(req.user.id);
    return res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// ─── Cancel Subscription ──────────────────────────────────────────────────────

exports.cancelSubscription = async (req, res, next) => {
  try {
    await cancelSubscriptionService(req.user.id);
    return res.json({
      success: true,
      message:
        "Your subscription will remain active until the end of the current billing period.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Resume Subscription ──────────────────────────────────────────────────────

exports.resumeSubscription = async (req, res, next) => {
  try {
    await resumeSubscriptionService(req.user.id);
    return res.json({
      success: true,
      message: "Your subscription has been resumed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ─── Admin: Get All Subscribers ───────────────────────────────────────────────

exports.getSubscribers = async (req, res, next) => {
  try {
    const users = await getSubscribersService();
    return res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};