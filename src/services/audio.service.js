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

exports.updateAudioService = async (
  id,
  req
) => {
  const audio = await Audio.findById(id);

  if (!audio) {
    throw new Error("Audio not found");
  }

  // =========================
  // UPDATE BASIC FIELDS
  // =========================

  if (req.body.title !== undefined) {
    audio.title = req.body.title.trim();
  }

  if (req.body.artist !== undefined) {
    audio.artist = req.body.artist.trim();
  }

  if (req.body.category !== undefined) {
    audio.category = req.body.category;
  }

  if (req.body.series !== undefined) {
    audio.series = req.body.series;
  }

  // =========================
  // REPLACE AUDIO FILE
  // =========================

  if (req.file) {
    const oldFilePath = path.join(
      process.cwd(),
      "storage/audio",
      audio.filename
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    audio.filename = req.file.filename;
    audio.mimetype = req.file.mimetype;
    audio.size = req.file.size;
  }

  await audio.save();

  return audio;
};
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