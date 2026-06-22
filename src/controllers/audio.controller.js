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
exports.streamAudio = async (req, res, next) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({
        message: "Audio not found",
      });
    }

    const filePath = path.join(
      process.cwd(),
      "storage/audio",
      audio.filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Audio file missing",
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize - 1;

      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, {
        start,
        end,
      });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": audio.mimetype,
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": audio.mimetype,
        "Accept-Ranges": "bytes",
      });

      fs.createReadStream(filePath).pipe(res);
    }
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