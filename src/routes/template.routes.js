const express = require("express");

const router = express.Router();

const {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/template.controller");

const { authenticate, isAdmin } = require("../middleware/auth.middleware");
const { handleTemplateImageUpload } = require("../middleware/templateUpload.middleware");

router.get("/", getTemplates);
router.get("/:id", getTemplate);

router.post("/", authenticate, isAdmin, handleTemplateImageUpload, createTemplate);

router.patch("/:id", authenticate, isAdmin, handleTemplateImageUpload, updateTemplate);

router.delete("/:id", authenticate, isAdmin, deleteTemplate);

module.exports = router;