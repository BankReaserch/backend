const express = require("express");
const router = express.Router();

const subscriberController = require("../controllers/subscriber.controller");
const {authenticate,isAdmin} = require("../middleware/auth.middleware");


router.post(
  "/subscribe",
  authenticate.optional || ((req, res, next) => next()),
  subscriberController.subscribe
);

router.get(
  "/verify/:token",
  subscriberController.verifySubscription
);

router.post(
  "/unsubscribe",
  subscriberController.unsubscribe
);
router.get("/",authenticate,isAdmin,subscriberController.getAllSubscribers
);

module.exports = router;