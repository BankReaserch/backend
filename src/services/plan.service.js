const stripe = require("../config/stripe");
const PlanPurchase = require("../models/planPurchase.model");

// ─── Create Checkout Session ──────────────────────────────────────────────────

exports.createCheckoutSessionService = async (req, billingType) => {
  const userId = req.user.id;

  if (!["subscription", "one-time"].includes(billingType)) {
    throw new Error("Invalid billing type.");
  }

  let session;

  if (billingType === "subscription") {
    session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { userId },
      },
      success_url: `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/plan`,
      metadata: { userId, billingType },
    });
  } else {
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

  await PlanPurchase.create({
    user: userId,
    stripeSessionId: session.id,
    amount: 50,
    status: "pending",
    billingType,
  });

  return session;
};

// ─── Verify Payment ───────────────────────────────────────────────────────────

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
    purchase.stripeSubscriptionId =
      session.subscription?.id ?? session.subscription;
    purchase.expiresAt = null;
  } else {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    purchase.expiresAt = expiresAt;
  }

  await purchase.save();
  return purchase;
};

// ─── Get Plan Status ──────────────────────────────────────────────────────────
// Fetches the latest active purchase and, for subscriptions, hydrates
// cancelAtPeriodEnd and currentPeriodEnd live from Stripe so the frontend
// always shows the true cancellation state without relying on a webhook.

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

  // For subscriptions, fetch live state from Stripe so cancel/resume is
  // reflected immediately without waiting for a webhook delivery.
  if (plan.billingType === "subscription" && plan.stripeSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        plan.stripeSubscriptionId
      );

      const planObject = plan.toObject();
      planObject.cancelAtPeriodEnd = subscription.cancel_at_period_end;
      planObject.currentPeriodEnd = new Date(
        subscription.current_period_end * 1000
      ).toISOString();

      return planObject;
    } catch {
      // If Stripe is unreachable, fall back to the database record
    }
  }

  return plan;
};

// ─── Stripe Webhook ───────────────────────────────────────────────────────────

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
      break;
  }

  return { received: true };
};

// ─── Billing History ──────────────────────────────────────────────────────────

exports.getBillingHistoryService = async (userId) => {
  return await PlanPurchase.find({ user: userId, status: "paid" }).sort({
    createdAt: -1,
  });
};

// ─── Cancel Subscription ──────────────────────────────────────────────────────

exports.cancelSubscriptionService = async (userId) => {
  const plan = await PlanPurchase.findOne({
    user: userId,
    active: true,
    billingType: "subscription",
  });

  if (!plan) throw new Error("No active subscription found.");

  await stripe.subscriptions.update(plan.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return true;
};

// ─── Resume Subscription ──────────────────────────────────────────────────────

exports.resumeSubscriptionService = async (userId) => {
  const plan = await PlanPurchase.findOne({
    user: userId,
    active: true,
    billingType: "subscription",
  });

  if (!plan) throw new Error("No active subscription found.");

  await stripe.subscriptions.update(plan.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  return true;
};

// ─── Admin: Get All Subscribers ───────────────────────────────────────────────

exports.getSubscribersService = async () => {
  return await PlanPurchase.find({ active: true })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};