const express = require("express");
const {authenticate,isAdmin} = require('../middleware/auth.middleware');

const router =express.Router();
const upload =require("../middleware/uploadAudio");
const {
  uploadAudio,
  getAudios,
  deleteAudio,
  streamAudio,
  downloadAudio,
} = require("../controllers/audio.controller");

router.post("/upload",authenticate,isAdmin,upload.single("audio"),uploadAudio);

router.get("/",authenticate,isAdmin, getAudios);

router.get(
  "/stream/:id",
  authenticate,
  isAdmin,
  streamAudio
);

router.get(
  "/download/:id",
  authenticate,isAdmin,
  downloadAudio
);
router.delete(
  "/:id",
  authenticate,isAdmin,
  deleteAudio
);

module.exports = router;