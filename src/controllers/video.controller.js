const fs = require("fs");
const videoService = require("../services/video.service");

exports.createVideoController = async (req, res) => {
  try {
    const { title, artist, category, series } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const file =
      req.file ||
      (req.files && req.files.video && req.files.video[0]);

    const video = await videoService.createVideo({
      title,
      artist,
      category,
      series,
      file,
      uploadedBy: req.user?.id,
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.getAllVideosController = async (req, res) => {
  try {
    const { search, category, series } = req.query;

    const videos = await videoService.getAllVideos({
      search,
      category,
      series,
    });

    return res.status(200).json({ videos });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};


exports.getSingleVideoController = async (req, res) => {
  try {
    const video = await videoService.getVideoById(req.params.id);

    return res.status(200).json({ video });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.updateVideoController = async (req, res) => {
  try {
    const { title, artist, category, series } = req.body;

    const file =
      req.file ||
      (req.files && req.files.video && req.files.video[0]);

    const video = await videoService.updateVideo(req.params.id, {
      title,
      artist,
      category,
      series,
      file,
    });

    return res.status(200).json({
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.deleteVideoController = async (req, res) => {
  try {
    await videoService.deleteVideo(req.params.id);

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.streamVideoController = async (req, res) => {
  try {
    const video = await videoService.getVideoFile(req.params.id);

    const stat = fs.statSync(video.path);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": video.mimetype || "video/mp4",
      });

      return fs.createReadStream(video.path).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(video.path, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": video.mimetype || "video/mp4",
    });

    fileStream.pipe(res);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

exports.downloadVideoController = async (req, res) => {
  try {
    const video = await videoService.getVideoFile(req.params.id);

    return res.download(video.path, video.filename);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};