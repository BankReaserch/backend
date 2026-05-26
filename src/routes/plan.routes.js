// routes/plan.routes.js

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

/*
========================================
PLAN
========================================
*/

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

module.exports =
  router;