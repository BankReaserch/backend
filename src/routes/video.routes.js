// routes/video.routes.js

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

const upload =
  require(
    "../middleware/upload.middleware"
  );

const {
  createVideoController,
  updateVideoController,
  getAllVideosController,
  getSingleVideoController,
  deleteVideoController,
  streamVideoController,
  downloadVideoController,
} = require(
  "../controllers/video.controller"
);

router.get(
  "/all",
  getAllVideosController
);

// GET SINGLE VIDEO
router.get(
  "/:id",
  getSingleVideoController
);

/*
========================================
ADMIN
========================================
*/

router.post(
  "/create",
  authenticate,
  isAdmin,
  upload.single("video"),
  createVideoController
);

// DELETE VIDEO
router.delete(
  "/delete/:id",
  authenticate,
  isAdmin,
  deleteVideoController
);

// PUBLIC: stream + download (no auth/plan gate — same as audio)
router.get(
  "/stream/:id",
  streamVideoController
);

router.get(
  "/download/:id",
  downloadVideoController
);

router.put(
  "/update/:id",
  authenticate,
  isAdmin,
  upload.single("video"),
  updateVideoController
);

module.exports =
  router;