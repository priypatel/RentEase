// const express = require("express");
// const router = express.Router();
// const upload = require("../../middleware/uploadMiddleware");
// const cloudinary = require("../../routes/utils/cloudinary");
// const fs = require("fs");

// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "rentease/uploads",
//     });

//     // Remove local temp file
//     fs.unlinkSync(req.file.path);

//     res.status(200).json({
//       success: true,
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Cloudinary upload failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// === Local Storage Setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1730892323.jpg
  },
});

const upload = multer({ storage });

// === Local Upload Route ===
router.post("/", upload.single("image"), (req, res) => {
  try {
    const filePath = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({
      success: true,
      url: filePath,
      localPath: `uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "File upload failed" });
  }
});

module.exports = router;
