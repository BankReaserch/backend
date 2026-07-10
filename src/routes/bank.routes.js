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
  previewBankReportController,
  backfillReportPreviewsController,
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

// PUBLIC: free preview (first pages only) — no auth / no plan required.
// The file served here is a physically truncated PDF generated at
// upload time, so there is nothing beyond the preview pages to leak.
router.get(
  "/preview-report/:id",
  previewBankReportController
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

// One-off backfill for reports uploaded before the preview feature
// existed. Call once (POST, admin session), then it's done.
router.post(
  "/backfill-report-previews",
  authenticate,
  isAdmin,
  backfillReportPreviewsController
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