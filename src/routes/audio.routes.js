const express = require("express");
// const {authenticate,isAdmin} = require('../middleware/auth.middleware');

const router =express.Router();
const upload =require("../middleware/uploadAudio");
const {
  uploadAudio,
  getAudios,
  deleteAudio,
  streamAudio,
  downloadAudio,
} = require("../controllers/audio.controller");

router.post("/upload",upload.single("audio"),uploadAudio);

router.get("/", getAudios);

router.get(
  "/stream/:id",
  
  streamAudio
);

router.get(
  "/download/:id",
  
  downloadAudio
);
router.delete(
  "/:id",
  
  deleteAudio
);

module.exports = router;