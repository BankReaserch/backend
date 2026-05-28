// routes/dashboard.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
  isAdmin,
} = require(
  "../middleware/auth.middleware"
);

const {
  getDashboardStatsController,
} = require(
  "../controllers/dashboard.controller"
);
const {
  getRevenueChartController,
} = require(
  "../controllers/dashboard.controller"
);

/*
========================================
ADMIN DASHBOARD
========================================
*/

router.get(
  "/stats",

  authenticate,

  isAdmin,

  getDashboardStatsController
);
router.get(
  "/revenue-chart",

  authenticate,

  isAdmin,

  getRevenueChartController
);

module.exports =
  router;