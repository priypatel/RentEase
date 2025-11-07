const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../../middleware/authMiddleware");

router.get(
  "/landlord/dashboard",
  verifyToken,
  verifyRole("landlord"),
  (req, res) => {
    res.json({ message: `Welcome landlord ${req.user.email}` });
  }
);
router.get(
  "/tenant/dashboard",
  verifyToken,
  verifyRole("tenant"),
  (req, res) => {
    res.json({ message: `Welcome tenant ${req.user.email}` });
  }
);

module.exports = router;
