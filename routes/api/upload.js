const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadMiddleware");
const cloudinary = require("../../routes/utils/cloudinary");
const fs = require("fs");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "rentease/uploads",
    });

    // Remove local temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Cloudinary upload failed" });
  }
});

module.exports = router;
