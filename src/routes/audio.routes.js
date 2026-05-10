const express = require("express");

const router =
  express.Router();

const upload =
  require("../middleware/uploadAudio");

const {
  uploadAudio,
  getAudios,
  deleteAudio,
  streamAudio,
  downloadAudio,
} = require("../controllers/audio.controller");

// =========================
// UPLOAD
// =========================
router.post(
  "/upload",
  upload.single("audio"),
  uploadAudio
);

// =========================
// GET ALL
// =========================
router.get("/", getAudios);

// =========================
// STREAM AUDIO
// =========================
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