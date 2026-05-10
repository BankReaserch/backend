const fs = require("fs");

const path = require("path");

const Audio = require("../models/audio.model");

const {
  uploadAudioService,
  getAudiosService,
  deleteAudioService,
} = require("../services/audio.service");

// =========================
// UPLOAD
// =========================
exports.uploadAudio =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await uploadAudioService(
          req
        );

      res.status(201).json({
        success: true,

        message:
          "Audio uploaded successfully",

        audio: result,
      });
    } catch (error) {
      next(error);
    }
  };

// =========================
// GET ALL
// =========================
exports.getAudios =
  async (
    req,
    res,
    next
  ) => {
    try {
      const audios =
        await getAudiosService();

      res.status(200).json({
        success: true,
        audios,
      });
    } catch (error) {
      next(error);
    }
  };

// =========================
// STREAM AUDIO
// =========================
exports.streamAudio =
  async (
    req,
    res,
    next
  ) => {
    try {
      const audio =
        await Audio.findById(
          req.params.id
        );

      if (!audio) {
        return res
          .status(404)
          .json({
            message:
              "Audio not found",
          });
      }

      // EXAMPLE ACCESS CONTROL
      // if (
      //   req.user.role !==
      //   "admin"
      // ) {
      //   return res
      //     .status(403)
      //     .json({
      //       message:
      //         "Access denied",
      //     });
      // }

      const filePath =
        path.join(
          process.cwd(),
          "storage/audio",
          audio.filename
        );

      if (
        !fs.existsSync(
          filePath
        )
      ) {
        return res
          .status(404)
          .json({
            message:
              "Audio file missing",
          });
      }

      const stat =
        fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type":
          audio.mimetype,

        "Content-Length":
          stat.size,
      });

      fs.createReadStream(
        filePath
      ).pipe(res);
    } catch (error) {
      next(error);
    }
  };

// =========================
// DOWNLOAD AUDIO
// =========================
exports.downloadAudio =
  async (
    req,
    res,
    next
  ) => {
    try {
      const audio =
        await Audio.findById(
          req.params.id
        );

      if (!audio) {
        return res
          .status(404)
          .json({
            message:
              "Audio not found",
          });
      }

      const filePath =
        path.join(
          process.cwd(),
          "storage/audio",
          audio.filename
        );

      res.download(
        filePath,
        audio.filename
      );
    } catch (error) {
      next(error);
    }
  };

// =========================
// DELETE
// =========================
exports.deleteAudio =
  async (
    req,
    res,
    next
  ) => {
    try {
      await deleteAudioService(
        req.params.id
      );

      res.status(200).json({
        success: true,

        message:
          "Audio deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };