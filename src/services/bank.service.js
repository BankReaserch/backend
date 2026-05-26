// services/bank.service.js

const Bank =
  require(
    "../models/bank.model"
  );

/*
========================================
CREATE BANK
========================================
*/

exports.createBankService =
  async (
    body,
    file,
    userId
  ) => {

    const bank =
      await Bank.create({
        ...body,

        reportUrl:
          file?.path || "",

        reportAvailable:
          !!file,

        createdBy:
          userId,
      });

    return bank;
  };

/*
========================================
GET ALL BANKS
========================================
*/

exports.getAllBanksService =
  async () => {

    const banks =
      await Bank.find()
        .sort({
          createdAt: -1,
        });

    return banks;
  };

/*
========================================
GET SINGLE BANK
========================================
*/

exports.getSingleBankService =
  async (id) => {

    const bank =
      await Bank.findById(
        id
      );

    if (!bank) {

      throw new Error(
        "Bank not found"
      );
    }

    return bank;
  };

/*
========================================
DELETE BANK
========================================
*/

exports.deleteBankService =
  async (id) => {

    const bank =
      await Bank.findById(
        id
      );

    if (!bank) {

      throw new Error(
        "Bank not found"
      );
    }

    await Bank.findByIdAndDelete(
      id
    );

    return true;
  };