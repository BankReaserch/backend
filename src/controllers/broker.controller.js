const {
  createBrokerService,
  getAllBrokersService,
  updateBrokerService,
  deleteBrokerService,
} = require(
  "../services/broker.service"
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

      const broker =
        await createBrokerService(
          req.body
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Broker created successfully",

          data: broker,
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
UPDATE
========================================
*/

exports.updateBrokerController =
  async (
    req,
    res
  ) => {

    try {

      const broker =
        await updateBrokerService(
          req.params.id,
          req.body
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

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message,
        });
    }
  };