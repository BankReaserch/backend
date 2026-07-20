const express = require("express");

const router = express.Router();

const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/business.controller");

const { authenticate, isAdmin } = require("../middleware/auth.middleware");
const { handleLogoUpload } = require("../middleware/businessUpload.middleware");

router.get("/", getBusinesses);
router.get("/:id", getBusiness);

router.post("/", authenticate, isAdmin, handleLogoUpload, createBusiness);

router.patch("/:id", authenticate, isAdmin, handleLogoUpload, updateBusiness);

router.delete("/:id", authenticate, isAdmin, deleteBusiness);

module.exports = router;