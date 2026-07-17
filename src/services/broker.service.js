const fs = require("fs");

const path = require("path");

const Broker =
  require(
    "../models/broker.model"
  );

const AppError =
  require(
    "../utils/AppError"
  );

const logoDir = path.join(
  __dirname,
  "../../uploads/broker-logos"
);

const deleteLogoFile = (logoUrl) => {
  if (!logoUrl) return;

  const filename = logoUrl.split(
    "/uploads/broker-logos/"
  )[1];

  if (!filename) return;

  const filePath = path.join(
    logoDir,
    filename
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const normalizeKosher = (data) => {
  const kosherStatus =
    data.kosherStatus ||
    "Totally Kosher";

  const kosherLine =
    kosherStatus ===
    "Offers Kosher Line"
      ? (data.kosherLine || "").trim()
      : "";

  if (
    kosherStatus ===
      "Offers Kosher Line" &&
    !kosherLine
  ) {
    throw new AppError(
      "Kosher line is required when a broker offers a kosher line",
      400
    );
  }

  return { kosherStatus, kosherLine };
};

/*
========================================
CREATE
========================================
*/

exports.createBrokerService =
  async (data) => {

    const {
      kosherStatus,
      kosherLine,
    } = normalizeKosher(data);

    return await Broker.create({
      ...data,
      kosherStatus,
      kosherLine,
    });
  };

/*
========================================
GET ALL
========================================
*/

exports.getAllBrokersService =
  async () => {

    return await Broker.find()
      .sort({
        createdAt: -1,
      });
  };

/*
========================================
UPDATE
========================================
*/

exports.updateBrokerService =
  async (
    id,
    data,
    logoUrl
  ) => {

    const broker =
      await Broker.findById(id);

    if (!broker) {
      throw new AppError(
        "Broker not found",
        404
      );
    }

    const {
      kosherStatus,
      kosherLine,
    } = normalizeKosher(data);

    Object.assign(broker, {
      ...data,
      kosherStatus,
      kosherLine,
    });

    if (logoUrl) {
      deleteLogoFile(broker.logoUrl);

      broker.logoUrl = logoUrl;
    }

    await broker.save();

    return broker;
  };

/*
========================================
DELETE
========================================
*/

exports.deleteBrokerService =
  async (id) => {

    const broker =
      await Broker.findById(id);

    if (!broker) {
      throw new AppError(
        "Broker not found",
        404
      );
    }

    deleteLogoFile(broker.logoUrl);

    await Broker.findByIdAndDelete(
      id
    );

    return true;
  };