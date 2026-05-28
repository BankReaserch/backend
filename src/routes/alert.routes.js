// routes/alert.routes.js

const express =
  require("express");

const router =
  express.Router();

const {
  authenticate,
  isAdmin,
} = require(
  "../middleware/auth.middleware"
);

const alertController =
  require(
    "../controllers/alert.controller"
  );

/*
========================================
PUBLIC ROUTES
========================================
*/

router.get(
  "/active",
  alertController.getActiveAlertsController
);

router.get(
  "/all",
  alertController.getAllAlertsController
);

router.get(
  "/:id",
  alertController.getSingleAlertController
);

/*
========================================
ADMIN ROUTES
========================================
*/

router.post(
  "/create",

  authenticate,

  isAdmin,

  alertController.createAlertController
);

router.put(
  "/update/:id",

  authenticate,

  isAdmin,

  alertController.updateAlertController
);

router.delete(
  "/delete/:id",

  authenticate,

  isAdmin,

  alertController.deleteAlertController
);

module.exports =
  router;