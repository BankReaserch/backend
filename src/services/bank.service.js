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
        name:
          body.name,

        type:
          body.type,

        location:
          body.location,

        status:
          body.status,

        website:
          body.website,

        assets:
          body.assets,

        founded:
          body.founded,

        lastReviewed:
          body.lastReviewed ||
          null,

        publicInfo:
          body.publicInfo,

        reportUrl:
          file?.filename ||
          "",

        reportAvailable:
          !!file,

        createdBy:
          userId,
      });

    return bank;
  };

/*
========================================
UPDATE BANK
========================================
*/

exports.updateBankService =
  async (
    id,
    body,
    file
  ) => {

    const bank =
      await Bank.findById(
        id
      );

    if (!bank) {

      throw new Error(
        "Bank not found"
      );
    }

    bank.name =
      body.name;

    bank.type =
      body.type;

    bank.location =
      body.location;

    bank.status =
      body.status;

    bank.website =
      body.website;

    bank.assets =
      body.assets;

    bank.founded =
      body.founded;

    bank.lastReviewed =
      body.lastReviewed ||
      null;

    bank.publicInfo =
      body.publicInfo;

    if (file) {

      bank.reportUrl =
        file.filename;

      bank.reportAvailable =
        true;
    }

    await bank.save();

    return bank;
  };

/*
========================================
GET ALL BANKS
========================================
*/

exports.getAllBanksService =
  async () => {

    return await Bank.find()
      .sort({
        createdAt: -1,
      });

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