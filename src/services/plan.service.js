const stripe =
  require(
    "../config/stripe"
  );

const PlanPurchase =
  require(
    "../models/planPurchase.model"
  );

exports.createCheckoutSessionService =
  async (
    req,
    billingType
  ) => {

    const userId =
      req.user.id;

    let session;

    if (
      billingType ===
      "subscription"
    ) {

      session =
        await stripe.checkout.sessions.create(
          {
            mode:
              "subscription",

            customer_email:
              req.user.email,

            line_items: [
              {
                price:
                  process.env
                    .STRIPE_MONTHLY_PRICE_ID,

                quantity: 1,
              },
            ],

            success_url:
              `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${process.env.CLIENT_URL}/plan`,

            metadata: {
              userId,
              billingType,
            },
          }
        );

    } else {

      session =
        await stripe.checkout.sessions.create(
          {
            payment_method_types:
              ["card"],

            mode:
              "payment",

            customer_email:
              req.user.email,

            line_items: [
              {
                price_data:
                  {
                    currency:
                      "usd",

                    product_data:
                      {
                        name:
                          "Premium Membership",
                      },

                    unit_amount:
                      5000,
                  },

                quantity: 1,
              },
            ],

            success_url:
              `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${process.env.CLIENT_URL}/plan`,

            metadata: {
              userId,
              billingType,
            },
          }
        );

    }

    await PlanPurchase.create(
      {
        user: userId,

        stripeSessionId:
          session.id,

        amount: 50,

        status:
          "pending",

        billingType,
      }
    );

    return session;
  };

exports.verifyPaymentService =
  async (
    sessionId
  ) => {

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: [
            "subscription",
          ],
        }
      );

    if (
      session.payment_status !==
      "paid"
    ) {

      throw new Error(
        "Payment not completed"
      );

    }

    const purchase =
      await PlanPurchase.findOne(
        {
          stripeSessionId:
            sessionId,
        }
      );

    if (!purchase) {

      throw new Error(
        "Purchase not found"
      );

    }

    purchase.status =
      "paid";

    purchase.active =
      true;

    purchase.stripePaymentIntentId =
      session.payment_intent;

    if (
      purchase.billingType ===
      "subscription"
    ) {

      purchase.stripeSubscriptionId =
        session.subscription?.id ||
        session.subscription;

      purchase.expiresAt =
        null;

    } else {

      const expiresAt =
        new Date();

      expiresAt.setDate(
        expiresAt.getDate() +
          30
      );

      purchase.expiresAt =
        expiresAt;

    }

    await purchase.save();

    return purchase;
  };

exports.getPlanStatusService =
  async (
    userId
  ) => {

    const plan =
      await PlanPurchase
        .findOne({
          user: userId,

          status:
            "paid",
        })
        .sort({
          createdAt: -1,
        });

    if (!plan) {

      return {
        active: false,
      };

    }

    if (
      plan.billingType ===
      "one-time"
    ) {

      if (
        plan.expiresAt &&
        plan.expiresAt <
          new Date()
      ) {

        plan.active =
          false;

        await plan.save();

        return {
          active: false,
        };

      }

    }

    return plan;
  };