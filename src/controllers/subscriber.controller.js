const subscriberService = require("../services/subscriber.service");

exports.subscribe = async (req, res) => {
  try {
    const result =
      await subscriberService.subscribe(
        req.user || null,
        req.body.email
      );

    return res.status(200).json(result);

  } catch (error) {

    console.error(
      "Subscribe Error:",
      error
    );

    return res.status(400).json({
      status: false,
      message:
        error.message ||
        "Unable to process subscription",
    });
  }
};

exports.verifySubscription = async (
  req,
  res
) => {
  try {

    await subscriberService.verifySubscription(
      req.params.token
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/alerts?subscription=verified`
    );

  } catch (error) {

    console.error(
      "Verification Error:",
      error
    );

    return res.redirect(
      `${process.env.FRONTEND_URL}/alerts?subscription=failed`
    );
  }
};

exports.unsubscribe = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message:
          "Email is required",
      });
    }

    await subscriberService.unsubscribe(
      email
    );

    return res.status(200).json({
      status: true,
      message:
        "Unsubscribed successfully",
    });

  } catch (error) {

    console.error(
      "Unsubscribe Error:",
      error
    );

    return res.status(400).json({
      status: false,
      message:
        error.message ||
        "Unable to unsubscribe",
    });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers =
      await subscriberService.getAllSubscribers();

    return res.status(200).json({
      status: true,
      count: subscribers.length,
      data: subscribers,
    });

  } catch (error) {

    console.error(
      "Get Subscribers Error:",
      error
    );

    return res.status(500).json({
      status: false,
      message:
        "Failed to fetch subscribers",
    });
  }
};