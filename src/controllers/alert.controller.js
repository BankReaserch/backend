// controllers/alert.controller.js

const {
  createAlertService,
  getAllAlertsService,
  getActiveAlertsService,
  getSingleAlertService,
  updateAlertService,
  deleteAlertService,
} = require(
  "../services/alert.service"
);

/*
========================================
CREATE ALERT
========================================
*/

exports.createAlertController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const alert =
        await createAlertService(
          req.body,
          req.user.id
        );

      return res
        .status(201)
        .json({
          success: true,

          message:
            "Alert created successfully",

          data: alert,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET ALL ALERTS
========================================
*/

exports.getAllAlertsController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const alerts =
        await getAllAlertsService();

      return res
        .status(200)
        .json({
          success: true,

          data: alerts,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET ACTIVE ALERTS
========================================
*/

exports.getActiveAlertsController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const alerts =
        await getActiveAlertsService();

      return res
        .status(200)
        .json({
          success: true,

          data: alerts,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
GET SINGLE ALERT
========================================
*/

exports.getSingleAlertController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const alert =
        await getSingleAlertService(
          req.params.id
        );

      return res
        .status(200)
        .json({
          success: true,

          data: alert,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
UPDATE ALERT
========================================
*/

exports.updateAlertController =
  async (
    req,
    res,
    next
  ) => {

    try {

      const alert =
        await updateAlertService(
          req.params.id,
          req.body
        );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Alert updated successfully",

          data: alert,
        });

    } catch (error) {

      next(error);

    }
  };

/*
========================================
DELETE ALERT
========================================
*/

exports.deleteAlertController =
  async (
    req,
    res,
    next
  ) => {

    try {

      await deleteAlertService(
        req.params.id
      );

      return res
        .status(200)
        .json({
          success: true,

          message:
            "Alert deleted successfully",
        });

    } catch (error) {

      next(error);

    }
  };