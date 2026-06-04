const express =
  require("express");

const router =
  express.Router();

const upload =
  require(
    "../middleware/upload.middleware"
  );

const {authenticate,isAdmin}= require('../middleware/auth.middleware')

const {
  createInvestmentController,
  getAllInvestmentsController,
  downloadInvestmentReportController,
  getSingleInvestmentController,
  updateInvestmentController,
  deleteInvestmentController,
} = require(
  "../controllers/investment.controller"
);

/*
====================================
PUBLIC
====================================
*/

router.get(
  "/",
  getAllInvestmentsController
);

router.get(
  "/:id",
  getSingleInvestmentController
);

router.get(
  "/download-report/:id",
  authenticate,
  downloadInvestmentReportController
);

router.post(
  "/",
  authenticate,
  isAdmin,
  upload.single("report"),
  createInvestmentController
);

router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload.single("report"),
  updateInvestmentController
);

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteInvestmentController
);

module.exports =
  router;