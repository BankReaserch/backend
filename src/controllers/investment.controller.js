const {
  createInvestmentService,
  getAllInvestmentsService,
  getSingleInvestmentService,
  updateInvestmentService,
  deleteInvestmentService,
} = require(
  "../services/investment.service"
);

const path =
  require("path");

const fs =
  require("fs");

const Investment =
  require(
    "../models/investment.model"
  );

const AppError =
  require(
    "../utils/AppError"
  );

const {
  sendErrorResponse,
} = require(
  "../utils/sendErrorResponse"
);

exports.createInvestmentController =
  async (req, res) => {
    try {

      const investment =
        await createInvestmentService(
          req.body,
          req.file,
          req.user.id
        );

      return res.status(201).json({
        success: true,
        data: investment,
      });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "createInvestmentController"
      );

    }
  };

exports.downloadInvestmentReportController =
  async (req, res) => {

    try {

      const investment =
        await Investment.findById(
          req.params.id
        );

      if (!investment?.reportUrl) {
        throw new AppError(
          "Report not found",
          404
        );
      }

      const reportsDir =
        path.join(
          __dirname,
          "../uploads/reports"
        );

      const filePath =
        path.join(
          reportsDir,
          path.basename(
            investment.reportUrl
          )
        );

      if (
        !filePath.startsWith(
          reportsDir
        ) ||
        !fs.existsSync(filePath)
      ) {
        throw new AppError(
          "Report not found",
          404
        );
      }

      return res.download(
        filePath,
        (err) => {
          if (err && !res.headersSent) {
            sendErrorResponse(
              res,
              err,
              "downloadInvestmentReportController"
            );
          }
        }
      );

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "downloadInvestmentReportController"
      );

    }

  };

exports.getAllInvestmentsController =
  async (req, res) => {
    try {

      const data =
        await getAllInvestmentsService();

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "getAllInvestmentsController"
      );

    }
  };

exports.getSingleInvestmentController =
  async (req, res) => {
    try {

      const data =
        await getSingleInvestmentService(
          req.params.id
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "getSingleInvestmentController"
      );

    }
  };

exports.updateInvestmentController =
  async (req, res) => {
    try {

      const data =
        await updateInvestmentService(
          req.params.id,
          req.body,
          req.file
        );

      return res.json({
        success: true,
        data,
      });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "updateInvestmentController"
      );

    }
  };

exports.deleteInvestmentController =
  async (req, res) => {
    try {

      await deleteInvestmentService(
        req.params.id
      );

      return res.json({
        success: true,
        message:
          "Investment deleted",
      });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "deleteInvestmentController"
      );

    }
  };