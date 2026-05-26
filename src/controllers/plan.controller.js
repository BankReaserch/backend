// controllers/plan.controller.js

const {
  createCheckoutSessionService,
  verifyPaymentService,
} = require(
  "../services/plan.service"
);

/*
========================================
CREATE STRIPE CHECKOUT
========================================
*/

exports.createCheckoutSession =
  async (
    req,
    res,
    next
  ) => {

    try {

      const session =
        await createCheckoutSessionService(
          req
        );

      return res
        .status(200)
        .json({
          success: true,

          url:
            session.url,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
VERIFY PAYMENT
========================================
*/

exports.verifyPayment =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        session_id,
      } = req.query;

      const result =
        await verifyPaymentService(
          session_id
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Plan activated",

          data: result,
        });

    } catch (error) {

      next(error);

    }
  };