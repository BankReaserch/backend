const Bank =
  require(
    "../models/bank.model"
  );



exports.createBankService =
  async (
    body,
    files,
    userId
  ) => {

    const reportFile =
      files?.report?.[0];

    const coverImage =
      files?.coverImage?.[0];

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
          reportFile
            ?.filename || "",

        reportAvailable:
          !!reportFile,

        coverImage:
          coverImage
            ?.filename || "",

        createdBy:
          userId,
      });

    return bank;
  };

exports.updateBankService =
  async (
    id,
    body,
    files
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

    const reportFile =
      files?.report?.[0];

    const coverImage =
      files?.coverImage?.[0];

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

    if (
      reportFile
    ) {

      bank.reportUrl =
        reportFile.filename;

      bank.reportAvailable =
        true;
    }

    if (
      coverImage
    ) {

      bank.coverImage =
        coverImage.filename;
    }

    await bank.save();

    return bank;
  };

exports.getAllBanksService =
  async () => {

    return await Bank.find()
      .sort({
        createdAt: -1,
      });

  };

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

exports.getAllBanksService =
  async () => {

    return await Bank.find()
      .sort({
        createdAt: -1,
      });

  };

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