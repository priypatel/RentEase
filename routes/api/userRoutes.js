import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { updateProfile, logoutUser } from "../../controllers/userController.js";

const router = express.Router();

// Update Profile
router.put("/update", verifyToken, updateProfile);

// Logout
router.post("/logout", verifyToken, logoutUser);

export default router;
