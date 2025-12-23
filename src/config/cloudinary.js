const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Detect Resource Type Automatically
 */
const detectResourceType = (mime) => {
  if (mime.startsWith("image")) return "image";
  if (mime.startsWith("audio") || mime.startsWith("video")) return "video";
  return "raw"; // PDF / DOC / PPT
};

module.exports = { cloudinary, detectResourceType };
