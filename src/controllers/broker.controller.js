const {
  createBrokerService,
  getAllBrokersService,
  updateBrokerService,
  deleteBrokerService,
} = require(
  "../services/broker.service"
);

const {
  sendErrorResponse,
} = require(
  "../utils/sendErrorResponse"
);

/*
========================================
CREATE
========================================
*/

exports.createBrokerController =
  async (
    req,
    res
  ) => {

    try {

      const logoUrl =
        req.file
          ? `${req.protocol}://${req.get(
              "host"
            )}/uploads/broker-logos/${
              req.file.filename
            }`
          : "";

      const broker =
        await createBrokerService({
          ...req.body,
          logoUrl,
        });

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Broker created successfully",

          data: broker,
        });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "createBrokerController"
      );
    }
  };

/*
========================================
GET ALL
========================================
*/

exports.getAllBrokersController =
  async (
    req,
    res
  ) => {

    try {

      const brokers =
        await getAllBrokersService();

      return res
        .status(200)
        .json({
          success: true,

          data: brokers,
        });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "getAllBrokersController"
      );
    }
  };

/*
========================================
UPDATE
========================================
*/

exports.updateBrokerController =
  async (
    req,
    res
  ) => {

    try {

      const logoUrl =
        req.file
          ? `${req.protocol}://${req.get(
              "host"
            )}/uploads/broker-logos/${
              req.file.filename
            }`
          : undefined;

      const broker =
        await updateBrokerService(
          req.params.id,
          req.body,
          logoUrl
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Broker updated successfully",

          data: broker,
        });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "updateBrokerController"
      );
    }
  };

/*
========================================
DELETE
========================================
*/

exports.deleteBrokerController =
  async (
    req,
    res
  ) => {

    try {

      await deleteBrokerService(
        req.params.id
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Broker deleted successfully",
        });

    } catch (error) {

      return sendErrorResponse(
        res,
        error,
        "deleteBrokerController"
      );
    }
  };