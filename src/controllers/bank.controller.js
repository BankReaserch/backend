// controllers/bank.controller.js
const path =
  require("path");

const fs =
  require("fs");

const {
  createBankService,
  updateBankService,
  getAllBanksService,
  getSingleBankService,
  deleteBankService,
} = require(
  "../services/bank.service"
);

/*
========================================
CREATE BANK
========================================
*/

exports.createBankController =
  async (
    req,
    res
  ) => {

    try {

      const bank =
        await createBankService(
          req.body,
          req.file,
          req.user.id
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Bank created successfully",

          data: bank,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };

/*
========================================
GET ALL BANKS
========================================
*/

exports.getAllBanksController =
  async (
    req,
    res
  ) => {

    try {

      const banks =
        await getAllBanksService();

      return res
        .status(200)
        .json({
          success: true,

          data: banks,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };

/*
========================================
GET SINGLE BANK
========================================
*/

exports.getSingleBankController =
  async (
    req,
    res
  ) => {

    try {

      const bank =
        await getSingleBankService(
          req.params.id
        );

      return res
        .status(200)
        .json({
          success: true,

          data: bank,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };

/*
========================================
DELETE BANK
========================================
*/

exports.deleteBankController =
  async (
    req,
    res
  ) => {

    try {

      await deleteBankService(
        req.params.id
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Bank deleted",
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };

  exports.viewBankReportController =
  async (
    req,
    res
  ) => {

    try {

      const bank =
        await getSingleBankService(
          req.params.id
        );

      if (
        !bank.reportUrl
      ) {

        return res.status(404)
          .json({
            success: false,
            message:
              "Report not found",
          });
      }

      const filePath =
        path.join(
          __dirname,
          "../uploads/reports",
          bank.reportUrl
        );

      if (
        !fs.existsSync(
          filePath
        )
      ) {

        return res.status(404)
          .json({
            success: false,
            message:
              "File not found",
          });
      }

      res.sendFile(
        filePath
      );

    } catch (error) {

      return res.status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

  exports.downloadBankReportController =
  async (
    req,
    res
  ) => {

    try {

      const bank =
        await getSingleBankService(
          req.params.id
        );

      if (
        !bank.reportUrl
      ) {

        return res.status(404)
          .json({
            success: false,
            message:
              "Report not found",
          });
      }

      const filePath =
        path.join(
          __dirname,
          "../uploads/reports",
          bank.reportUrl
        );

      if (
        !fs.existsSync(
          filePath
        )
      ) {

        return res.status(404)
          .json({
            success: false,
            message:
              "File not found",
          });
      }

      res.download(
        filePath
      );

    } catch (error) {

      return res.status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

  /*
========================================
UPDATE BANK
========================================
*/

exports.updateBankController =
  async (
    req,
    res
  ) => {

    try {

      const bank =
        await updateBankService(
          req.params.id,
          req.body,
          req.file
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Bank updated successfully",

          data: bank,
        });

    } catch (error) {

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };