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

const Investment =
  require(
    "../models/investment.model"
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

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

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
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      const filePath = path.join(
        __dirname,
        "../uploads/reports",
        investment.reportUrl
      );

      return res.download(
        filePath
      );

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

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

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

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

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

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

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

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

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };