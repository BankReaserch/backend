// routes/bank.routes.js

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
const requirePlan = require("../middleware/requirePlan.middleware");

const upload =
  require(
    "../middleware/upload.middleware"
  );

const {
  createBankController,
  updateBankController,
  getAllBanksController,
  getSingleBankController,
  deleteBankController,
  downloadBankReportController,
  viewBankReportController,
} = require(
  "../controllers/bank.controller"
);

router.get(
  "/all",
  getAllBanksController
);

// GET SINGLE BANK
router.get(
  "/:id",
  getSingleBankController
);

/*
========================================
ADMIN
========================================
*/

router.post(
  "/create",
  authenticate,
  isAdmin,
  upload.fields([
    {
      name: "report",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createBankController
);

// DELETE BANK
router.delete(
  "/delete/:id",
  authenticate,
  isAdmin,
  deleteBankController
);

router.get(
  "/view-report/:id",
  authenticate,
  requirePlan,
  viewBankReportController
);

router.get(
  "/download-report/:id",
  authenticate,
  requirePlan,
  downloadBankReportController
);

router.put(
  "/update/:id",
  authenticate,
  isAdmin,
  upload.fields([
    {
      name: "report",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateBankController
);
module.exports =
  router;