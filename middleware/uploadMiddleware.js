const multer = require("multer");
const path = require("path");

// store in memory temporarily before upload to Cloudinary
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP allowed."), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
