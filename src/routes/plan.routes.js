const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
} = require(
  "../middleware/auth.middleware"
);

const planController =
  require(
    "../controllers/plan.controller"
  );

router.post(
  "/checkout",
  authenticate,
  planController.createCheckoutSession
);

router.get(
  "/verify",
  authenticate,
  planController.verifyPayment
);

router.get(
  "/status",
  authenticate,
  planController.getPlanStatus
);

module.exports =
  router;