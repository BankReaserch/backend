// controllers/bank.controller.js

const {
  createBankService,
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