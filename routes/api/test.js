import express from "express";
import { verifyToken, verifyRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

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

export default router;
