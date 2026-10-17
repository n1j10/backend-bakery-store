const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Same rules as the Next.js imageSchema: images only, max 1 MB.
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(ApiError.badRequest("File must be an image"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = { uploadImage };
