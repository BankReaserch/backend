const express = require("express");

const router = express.Router();

const {
  createBankRequest,
  getBankRequests,
  updateBankRequest,
  deleteBankRequest,
} = require("../controllers/bankrequest.controller");

const {
  authenticate,
  isAdmin,
} = require("../middleware/auth.middleware");

router.post("/", createBankRequest);

router.get("/",authenticate,isAdmin,getBankRequests);

router.patch(
  "/:id",
  authenticate,
  isAdmin,
  updateBankRequest
);

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteBankRequest
);

module.exports = router;