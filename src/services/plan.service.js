// services/plan.service.js

const stripe =
  require(
    "../config/stripe"
  );

const PlanPurchase =
  require(
    "../models/planPurchase.model"
  );

/*
========================================
CREATE CHECKOUT SESSION
========================================
*/

exports.createCheckoutSessionService =
  async (
    req
  ) => {

    const userId =
      req.user.id;

    /*
    ========================================
    CREATE STRIPE SESSION
    ========================================
    */

    const session =
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
                        "Unlimited Premium Access",

                      description:
                        "Unlimited access to all premium research reports",
                    },

                  unit_amount:
                    3000,
                },

              quantity: 1,
            },
          ],

          success_url: `${process.env.CLIENT_URL}/plan/success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url: `${process.env.CLIENT_URL}/plan`,

          metadata: {
            userId,
          },
        }
      );

    /*
    ========================================
    SAVE PURCHASE
    ========================================
    */

    await PlanPurchase.create(
      {
        user: userId,

        stripeSessionId:
          session.id,

        amount: 30,

        status:
          "pending",
      }
    );

    return session;
  };

/*
========================================
VERIFY PAYMENT
========================================
*/

exports.verifyPaymentService =
  async (
    sessionId
  ) => {

    const session =
      await stripe.checkout.sessions.retrieve(
        sessionId
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

    await purchase.save();

    return purchase;
  };