// controllers/bank.controller.js

const path = require("path");
const fs = require("fs");

const {
  createBankService,
  updateBankService,
  getAllBanksService,
  getSingleBankService,
  deleteBankService,
  backfillReportPreviewsService,
} = require("../services/bank.service");

exports.createBankController = async (
  req,
  res,
  next
) => {
  try {
    const bank = await createBankService(
      req.body,
      req.files,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBanksController = async (
  req,
  res
) => {
  try {
    const banks = await getAllBanksService();

    return res.status(200).json({
      success: true,
      data: banks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleBankController = async (
  req,
  res
) => {
  try {
    const bank = await getSingleBankService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBankController = async (
  req,
  res
) => {
  try {
    await deleteBankService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Bank deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.viewBankReportController = async (
  req,
  res
) => {
  try {
    const bank = await getSingleBankService(
      req.params.id
    );

    if (!bank.reportUrl) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/reports",
      bank.reportUrl
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.downloadBankReportController = async (
  req,
  res
) => {
  try {
    const bank = await getSingleBankService(
      req.params.id
    );

    if (!bank.reportUrl) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/reports",
      bank.reportUrl
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.download(filePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUBLIC — no authenticate/requirePlan. Serves only the physically
// truncated (first N pages) preview PDF, generated at upload time in
// bank.service.js. There is nothing beyond those pages in this file
// for a free user to extract.
exports.previewBankReportController = async (
  req,
  res
) => {
  try {
    const bank = await getSingleBankService(
      req.params.id
    );

    if (!bank.reportPreview) {
      return res.status(404).json({
        success: false,
        message: "Preview not available",
      });
    }

    const filePath = path.join(
      __dirname,
      "../uploads/reports",
      bank.reportPreview
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Preview file not found",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Cache-Control", "no-store");

    res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADMIN — one-off backfill for banks whose report predates the
// preview feature. Reuses the app's existing DB connection, so it's
// just a normal authenticated request, not a separate script.
exports.backfillReportPreviewsController = async (
  req,
  res
) => {
  try {
    const results = await backfillReportPreviewsService();

    return res.status(200).json({
      success: true,
      ...results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBankController = async (
  req,
  res,
  next
) => {
  try {
    const bank = await updateBankService(
      req.params.id,
      req.body,
      req.files
    );

    return res.status(200).json({
      success: true,
      data: bank,
    });
  } catch (error) {
    next(error);
  }
};