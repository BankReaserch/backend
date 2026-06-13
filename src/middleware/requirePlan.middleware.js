const PlanPurchase = require("../models/planPurchase.model");
const requirePlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const plan = await PlanPurchase.findOne({
      user: userId,
      status: "paid",
      active: true,
    }).sort({ createdAt: -1 });

    // No paid plan at all
    if (!plan) {
      return res.status(403).json({
        success: false,
        code: "NO_ACTIVE_PLAN",
        message: "A Premium Membership is required to access this content.",
      });
    }

    if (
      plan.billingType === "one-time" &&
      plan.expiresAt &&
      plan.expiresAt < new Date()
    ) {
      // Keep the DB in sync
      plan.active = false;
      await plan.save();

      return res.status(403).json({
        success: false,
        code: "PLAN_EXPIRED",
        message: "Your membership has expired. Please renew to continue.",
      });
    }

    req.plan = plan;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = requirePlan;