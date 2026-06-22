const fs = require("fs");

const path = require("path");

const Audio = require("../models/audio.model");

// =========================
// UPLOAD
// =========================
exports.uploadAudioService =
  async (req) => {
    if (!req.file) {
      throw new Error(
        "Audio file is required"
      );
    }

    const {
      title,
      artist,
      category,
      series,
    } = req.body;

    if (!title) {
      throw new Error(
        "Audio title is required"
      );
    }

    const audio =
      await Audio.create({
        title,

        artist,

        category:
          category || "English",

        series:
          series || "",

        filename:
          req.file.filename,

        mimetype:
          req.file.mimetype,

        size: req.file.size,
      });

    return audio;
  };

// =========================
// GET ALL
// =========================
exports.getAudiosService =
  async () => {
    return await Audio.find().sort(
      {
        createdAt: -1,
      }
    );
  };

// =========================
// DELETE
// =========================
exports.deleteAudioService =
  async (id) => {
    const audio =
      await Audio.findById(id);

    if (!audio) {
      throw new Error(
        "Audio not found"
      );
    }

    const filePath =
      path.join(
        process.cwd(),
        "storage/audio",
        audio.filename
      );

    if (
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }

    await audio.deleteOne();

    return true;
  };