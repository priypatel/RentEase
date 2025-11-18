// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "rentease/properties",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });

// // Validation
// function fileFilter(req, file, cb) {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error("Only JPEG, PNG, JPG, and WEBP are allowed"));
//   }

//   cb(null, true);
// }

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
//   fileFilter,
// });

// export default upload;
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs";

const USE_CLOUDINARY = process.env.USE_CLOUDINARY === "true";

// VALIDATION
function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, JPG and WEBP allowed"));
  }
  cb(null, true);
}

// CLOUDINARY STORAGE
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rentease/properties",
  },
});

// LOCAL STORAGE
const uploadDir = "uploads/properties";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});

const storage = USE_CLOUDINARY ? cloudinaryStorage : localStorage;

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
