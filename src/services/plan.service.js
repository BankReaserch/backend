const stripe = require("../config/stripe");
const PlanPurchase = require("../models/planPurchase.model");

// ─── Create Checkout Session ──────────────────────────────────────────────────

exports.createCheckoutSessionService = async (req, billingType) => {
  const userId = req.user.id;

  // Validate billingType early so a bad payload never reaches Stripe
  if (!["subscription", "one-time"].includes(billingType)) {
    throw new Error("Invalid billing type.");
  }

  let session;

  if (billingType === "subscription") {
    // Monthly subscription — auto-renews via Stripe Billing.
    // STRIPE_MONTHLY_PRICE_ID must be a recurring Price object in your Stripe dashboard.
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      // Stripe will charge the customer automatically each month.
      // When a renewal payment succeeds/fails Stripe fires a webhook —
      // handle `invoice.payment_succeeded` and `invoice.payment_failed` there.
      subscription_data: {
        metadata: { userId },
      },
      success_url: `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/plan`,
      metadata: { userId, billingType },
    });

  } else {
    // One-time — expires after 30 days; user must pay again to renew.
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Premium Membership (30 days)" },
            unit_amount: 5000, // $50.00
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/plan`,
      metadata: { userId, billingType },
    });
  }

  // Record a pending purchase immediately so we can match it on verify
  await PlanPurchase.create({
    user: userId,
    stripeSessionId: session.id,
    amount: 50,
    status: "pending",
    billingType,
  });

  return session;
};

// ─── Verify Payment (called from /plan/success) ───────────────────────────────

exports.verifyPaymentService = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed.");
  }

  const purchase = await PlanPurchase.findOne({ stripeSessionId: sessionId });
  if (!purchase) throw new Error("Purchase record not found.");

  // Idempotent — safe to call more than once (e.g. user refreshes success page)
  if (purchase.status === "paid") return purchase;

  purchase.status = "paid";
  purchase.active = true;
  purchase.stripePaymentIntentId = session.payment_intent;

  if (purchase.billingType === "subscription") {
    // Store the subscription ID so webhooks can find this record later
    purchase.stripeSubscriptionId =
      session.subscription?.id ?? session.subscription;
    purchase.expiresAt = null; // subscription never expires client-side
  } else {
    // One-time: expire exactly 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    purchase.expiresAt = expiresAt;
  }

  await purchase.save();
  return purchase;
};

// ─── Get Plan Status ──────────────────────────────────────────────────────────

exports.getPlanStatusService = async (userId) => {
  const plan = await PlanPurchase.findOne({ user: userId, status: "paid" }).sort({
    createdAt: -1,
  });

  if (!plan) return { active: false };

  // One-time plan: check expiry
  if (plan.billingType === "one-time" && plan.expiresAt && plan.expiresAt < new Date()) {
    plan.active = false;
    await plan.save();
    return { active: false };
  }

  return plan;
};

// ─── Webhook Handler (subscription lifecycle) ─────────────────────────────────
// Wire this up in your routes: router.post("/webhook", express.raw({ type: "application/json" }), ...)
// This handles Stripe auto-charge events so subscription renewals stay in sync.

exports.handleStripeWebhookService = async (rawBody, signature) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {

    // Subscription renewed successfully — keep plan active
    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      if (!invoice.subscription) break;

      await PlanPurchase.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { status: "paid", active: true },
        { sort: { createdAt: -1 } }
      );
      break;
    }

    // Renewal payment failed — deactivate access
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      if (!invoice.subscription) break;

      await PlanPurchase.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        { status: "failed", active: false },
        { sort: { createdAt: -1 } }
      );
      break;
    }

    // Subscription cancelled by user or Stripe — deactivate access
    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await PlanPurchase.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { active: false },
        { sort: { createdAt: -1 } }
      );
      break;
    }

    default:
      // Ignore unhandled event types
      break;
  }

  return { received: true };
};