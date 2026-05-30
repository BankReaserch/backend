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

/*
========================================
PUBLIC
========================================
*/

// GET ALL BANKS
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

// CREATE BANK
router.post(
  "/create",
  authenticate,
  isAdmin,
  upload.single(
    "report"
  ),
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
  viewBankReportController
);

router.get(
  "/download-report/:id",
  authenticate,
  downloadBankReportController
);

router.put(
  "/update/:id",
  authenticate,
  isAdmin,
  upload.single(
    "report"
  ),
  updateBankController
);
module.exports =
  router;