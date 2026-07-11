const express = require("express");

const { authenticate, isAdmin } = require("../middleware/auth.middleware");

const router = express.Router();
const upload = require("../middleware/uploadAudio");
const {
  uploadAudio,
  getAudios,
  deleteAudio,
  streamAudio,
  downloadAudio,
  updateAudio,
} = require("../controllers/audio.controller");

// PUBLIC — list, stream, download stay open (matches your decision to
// keep audio freely accessible, unlike video/reports).
router.get("/", getAudios);

router.get("/stream/:id", streamAudio);

router.get("/download/:id", downloadAudio);

/*
========================================
ADMIN — was previously wide open (authenticate/isAdmin were
commented out), meaning anyone could upload or delete audio files
with no login at all. Locked down to match bank/video/book.
========================================
*/

router.post(
  "/upload",
  authenticate,
  isAdmin,
  upload.single("audio"),
  uploadAudio
);

router.put(
  "/:id",
  authenticate,
  isAdmin,
  upload.single("audio"),
  updateAudio
);

router.delete(
  "/:id",
  authenticate,
  isAdmin,
  deleteAudio
);

module.exports = router;