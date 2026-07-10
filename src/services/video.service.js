// services/video.service.js

const fs = require("fs");
const Video = require("../models/video.model");
exports.createVideo = async ({
  title,
  artist,
  category,
  series,
  file,
  uploadedBy,
}) => {
  if (!file) {
    throw { status: 400, message: "Video file is required" };
  }

  const video = await Video.create({
    title,
    artist,
    category,
    series,
    filename: file.filename,
    path: file.path,
    mimetype: file.mimetype,
    size: file.size,
    uploadedBy,
  });

  return video;
};

exports.getAllVideos = async ({
  search,
  category,
  series,
} = {}) => {
  const filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (series !== undefined) {
    filter.series = series;
  }

  const videos = await Video.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return videos;
};

exports.getVideoById = async (id) => {
  const video = await Video.findById(id).lean();

  if (!video) {
    throw { status: 404, message: "Video not found" };
  }

  return video;
};

exports.updateVideo = async (
  id,
  { title, artist, category, series, file }
) => {
  const video = await Video.findById(id);

  if (!video) {
    throw { status: 404, message: "Video not found" };
  }

  if (title !== undefined) video.title = title;
  if (artist !== undefined) video.artist = artist;
  if (category !== undefined) video.category = category;
  if (series !== undefined) video.series = series;

  if (file) {
    // remove old file from disk before replacing
    if (video.path && fs.existsSync(video.path)) {
      fs.unlink(video.path, () => {});
    }

    video.filename = file.filename;
    video.path = file.path;
    video.mimetype = file.mimetype;
    video.size = file.size;
  }

  await video.save();

  return video;
};

exports.deleteVideo = async (id) => {
  const video = await Video.findById(id);

  if (!video) {
    throw { status: 404, message: "Video not found" };
  }

  if (video.path && fs.existsSync(video.path)) {
    fs.unlink(video.path, () => {});
  }

  await video.deleteOne();

  return video;
};

exports.getVideoFile = async (id) => {
  const video = await Video.findById(id).lean();

  if (!video) {
    throw { status: 404, message: "Video not found" };
  }

  if (!video.path || !fs.existsSync(video.path)) {
    throw { status: 404, message: "Video file missing on server" };
  }

  return video;
};