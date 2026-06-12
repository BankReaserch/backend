const {
  createCheckoutSessionService,
  verifyPaymentService,
  getPlanStatusService,
  handleStripeWebhookService,
} = require("../services/plan.service");

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { billingType } = req.body;
    const session = await createCheckoutSessionService(req, billingType);
    return res.json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { session_id } = req.query;
    const result = await verifyPaymentService(session_id);
    return res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getPlanStatus = async (req, res, next) => {
  try {
    const plan = await getPlanStatusService(req.user.id);
    return res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// Called by Stripe — NO authenticate middleware on this route
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