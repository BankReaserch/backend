// services/alert.service.js

const Alert =
  require(
    "../models/alert.model"
  );

/*
========================================
CREATE ALERT
========================================
*/

exports.createAlertService =
  async (
    data,
    userId
  ) => {

    const alert =
      await Alert.create({
        ...data,

        createdBy:
          userId,
      });

    return alert;
  };

/*
========================================
GET ALL ALERTS
========================================
*/

exports.getAllAlertsService =
  async () => {

    const alerts =
      await Alert.find()
        .sort({
          createdAt: -1,
        });

    return alerts;
  };

/*
========================================
GET ACTIVE ALERTS
========================================
*/

exports.getActiveAlertsService =
  async () => {

    const alerts =
      await Alert.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    return alerts;
  };

/*
========================================
GET SINGLE ALERT
========================================
*/

exports.getSingleAlertService =
  async (
    id
  ) => {

    const alert =
      await Alert.findById(
        id
      );

    if (!alert) {

      throw new Error(
        "Alert not found"
      );
    }

    return alert;
  };

/*
========================================
UPDATE ALERT
========================================
*/

exports.updateAlertService =
  async (
    id,
    data
  ) => {

    const alert =
      await Alert.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        }
      );

    if (!alert) {

      throw new Error(
        "Alert not found"
      );
    }

    return alert;
  };

/*
========================================
DELETE ALERT
========================================
*/

exports.deleteAlertService =
  async (
    id
  ) => {

    const alert =
      await Alert.findById(
        id
      );

    if (!alert) {

      throw new Error(
        "Alert not found"
      );
    }

    await Alert.findByIdAndDelete(
      id
    );

    return true;
  };