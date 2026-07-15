// services/bank.service.js

const path = require("path");
const fs = require("fs");

const Bank = require("../models/bank.model");
const { generatePdfPreview } = require("../utils/pdfPreview.util");

// Reports live in backend/storage/reports — protected, never
// statically mounted. Matches bookUpload.js's storage/books
// convention and the (now-fixed) upload.middleware.js destination.
const REPORTS_DIR = path.join(
  __dirname,
  "..",
  "..",
  "storage",
  "reports"
);

// Generates a physically 1-page-only PDF next to the full report and
// returns its filename, or "" if generation fails (e.g. non-PDF
// upload). The free preview is now shown fully blurred behind an
// upgrade paywall on the frontend, so there's no reason to ship more
// than a single page down to the browser. Never throws — a failed
// preview shouldn't block the create/update of the bank itself.
const buildReportPreview = async (reportFile) => {
  if (!reportFile) return "";

  try {
    const previewFilename = `preview-${reportFile.filename}`;
    const previewPath = path.join(REPORTS_DIR, previewFilename);

    await generatePdfPreview(reportFile.path, previewPath, 1);

    return previewFilename;
  } catch (error) {
    console.error(
      "Report preview generation failed:",
      error.message
    );
    return "";
  }
};

exports.createBankService = async (
  body,
  files,
  userId
) => {
  const reportFile = files?.report?.[0];
  const coverImage = files?.coverImage?.[0];

  const reportPreview = await buildReportPreview(reportFile);

  const bank = await Bank.create({
    name: body.name,
    type: body.type,
    location: body.location,
    status: body.status,
    website: body.website,
    assets: body.assets,
    founded: body.founded,
    lastReviewed: body.lastReviewed || null,
    publicInfo: body.publicInfo,

    reportUrl: reportFile?.filename || "",
    reportAvailable: !!reportFile,
    reportPreview,

    coverImage: coverImage?.filename || "",
    createdBy: userId,
  });

  return bank;
};

exports.updateBankService = async (
  id,
  body,
  files
) => {
  const bank = await Bank.findById(id);

  if (!bank) {
    throw new Error("Bank not found");
  }

  const reportFile = files?.report?.[0];
  const coverImage = files?.coverImage?.[0];

  bank.name = body.name;
  bank.type = body.type;
  bank.location = body.location;
  bank.status = body.status;
  bank.website = body.website;
  bank.assets = body.assets;
  bank.founded = body.founded;
  bank.lastReviewed = body.lastReviewed || null;
  bank.publicInfo = body.publicInfo;

  if (reportFile) {
    bank.reportUrl = reportFile.filename;
    bank.reportAvailable = true;
    bank.reportPreview = await buildReportPreview(reportFile);
  }

  if (coverImage) {
    bank.coverImage = coverImage.filename;
  }

  await bank.save();

  return bank;
};

exports.getAllBanksService = async () => {
  return await Bank.find().sort({ createdAt: -1 });
};

exports.getSingleBankService = async (id) => {
  const bank = await Bank.findById(id);

  if (!bank) {
    throw new Error("Bank not found");
  }

  return bank;
};

exports.deleteBankService = async (id) => {
  const bank = await Bank.findById(id);

  if (!bank) {
    throw new Error("Bank not found");
  }

  await Bank.findByIdAndDelete(id);

  return true;
};

// One-off backfill: generates a preview for every bank that already
// has a full report on disk but no reportPreview yet (anything
// created/updated before the preview feature existed). Runs inside
// the already-connected app — no separate DB connection needed.
// Safe to call more than once; already-backfilled banks are skipped.
exports.backfillReportPreviewsService = async () => {
  const banks = await Bank.find({
    reportUrl: { $exists: true, $ne: "" },
    $or: [
      { reportPreview: { $exists: false } },
      { reportPreview: "" },
    ],
  });

  const results = {
    total: banks.length,
    succeeded: 0,
    skipped: 0,
    failed: 0,
    details: [],
  };

  for (const bank of banks) {
    const sourcePath = path.join(REPORTS_DIR, bank.reportUrl);

    if (!fs.existsSync(sourcePath)) {
      results.skipped++;
      results.details.push({
        bank: bank.name,
        status: "skipped",
        reason: "report file missing on disk",
      });
      continue;
    }

    const previewFilename = await buildReportPreview({
      filename: bank.reportUrl,
      path: sourcePath,
    });

    if (!previewFilename) {
      results.failed++;
      results.details.push({
        bank: bank.name,
        status: "failed",
      });
      continue;
    }

    bank.reportPreview = previewFilename;
    await bank.save();

    results.succeeded++;
    results.details.push({
      bank: bank.name,
      status: "ok",
    });
  }

  return results;
};