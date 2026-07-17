const Investment =
  require(
    "../models/investment.model"
  );

const AppError =
  require(
    "../utils/AppError"
  );

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

exports.getAllInvestmentsService =
  async () => {

    return await Investment.find()
      .sort({
        createdAt: -1,
      });
  };

exports.getSingleInvestmentService =
  async (id) => {

    const investment =
      await Investment.findById(
        id
      );

    if (!investment) {
      throw new AppError(
        "Investment not found",
        404
      );
    }

    return investment;
  };

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
      throw new AppError(
        "Investment not found",
        404
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

exports.deleteInvestmentService =
  async (id) => {

    const investment =
      await Investment.findById(
        id
      );

    if (!investment) {
      throw new AppError(
        "Investment not found",
        404
      );
    }

    await Investment.findByIdAndDelete(
      id
    );

    return true;
  };