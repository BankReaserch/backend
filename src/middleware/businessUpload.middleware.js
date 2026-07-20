const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "businesses");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : ".jpg";
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${safeExt}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed"));
  }
  cb(null, true);
}

const uploadLogo = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
});
function handleLogoUpload(req, res, next) {
  uploadLogo.single("logo")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image must be smaller than 5MB" });
      }
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
}
async function verifyImageSignature(filePath) {
  let fd;
  try {
    const buffer = Buffer.alloc(12);
    fd = await fsPromises.open(filePath, "r");
    await fd.read(buffer, 0, 12, 0);

    const hex = buffer.toString("hex");
    const isJPEG = hex.startsWith("ffd8ff");
    const isPNG = hex.startsWith("89504e470d0a1a0a");
    const isGIF = buffer.slice(0, 4).toString("ascii") === "GIF8";
    const isWEBP =
      buffer.slice(0, 4).toString("ascii") === "RIFF" &&
      buffer.slice(8, 12).toString("ascii") === "WEBP";

    return isJPEG || isPNG || isGIF || isWEBP;
  } catch {
    return false;
  } finally {
    if (fd) await fd.close();
  }
}

function deleteLogoFile(logoUrlOrFilename) {
  if (!logoUrlOrFilename) return;
  try {
    const filename = path.basename(logoUrlOrFilename);
    const fullPath = path.join(UPLOAD_DIR, filename);
    if (!fullPath.startsWith(UPLOAD_DIR)) return;
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  } catch (err) {
    console.error("Failed to delete logo file:", err.message);
  }
}

module.exports = {
  handleLogoUpload,
  verifyImageSignature,
  deleteLogoFile,
  UPLOAD_DIR,
};