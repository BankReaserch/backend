const {
  createCheckoutSessionService,
  verifyPaymentService,
  getPlanStatusService,
} = require(
  "../services/plan.service"
);

exports.createCheckoutSession =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        billingType,
      } = req.body;

      const session =
        await createCheckoutSessionService(
          req,
          billingType
        );

      return res.json({
        success: true,
        url: session.url,
      });

    } catch (error) {

      next(error);

    }

  };

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

      return res.json({
        success: true,
        data: result,
      });

    } catch (error) {

      next(error);

    }

  };

exports.getPlanStatus =
  async (
    req,
    res,
    next
  ) => {

    try {

      const plan =
        await getPlanStatusService(
          req.user.id
        );

      return res.json({
        success: true,
        data: plan,
      });

    } catch (error) {

      next(error);

    }

  };