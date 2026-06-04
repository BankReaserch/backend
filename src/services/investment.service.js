const Investment =
  require(
    "../models/investment.model"
  );

/*
====================================
CREATE
====================================
*/

exports.createInvestmentService =
  async (
    body,
    file,
    userId
  ) => {

    return await Investment.create({
      ...body,

      reportUrl:
        file?.filename || "",

      reportAvailable:
        !!file,

      createdBy:
        userId,
    });
  };

/*
====================================
GET ALL
====================================
*/

exports.getAllInvestmentsService =
  async () => {

    return await Investment.find()
      .sort({
        createdAt: -1,
      });
  };

/*
====================================
GET SINGLE
====================================
*/

exports.getSingleInvestmentService =
  async (id) => {

    const investment =
      await Investment.findById(
        id
      );

    if (!investment) {
      throw new Error(
        "Investment not found"
      );
    }

    return investment;
  };

/*
====================================
UPDATE
====================================
*/

exports.updateInvestmentService =
  async (
    id,
    body,
    file
  ) => {

    const investment =
      await Investment.findById(
        id
      );

    if (!investment) {
      throw new Error(
        "Investment not found"
      );
    }

    Object.assign(
      investment,
      body
    );

    if (file) {
      investment.reportUrl =
        file.filename;

      investment.reportAvailable =
        true;
    }

    await investment.save();

    return investment;
  };

/*
====================================
DELETE
====================================
*/

exports.deleteInvestmentService =
  async (id) => {

    const investment =
      await Investment.findById(
        id
      );

    if (!investment) {
      throw new Error(
        "Investment not found"
      );
    }

    await Investment.findByIdAndDelete(
      id
    );

    return true;
  };