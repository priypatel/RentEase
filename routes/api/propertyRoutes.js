import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../../controllers/propertyController.js";
import upload from "../../middleware/upload.js";
import { verifyToken, verifyRole } from "../../middleware/authMiddleware.js";

const router = express.Router();

// landlord-only = verifyRole("landlord")
router.post(
  "/",
  verifyToken,
  verifyRole("landlord"),
  upload.array("images"),
  createProperty
);
router.put(
  "/:id",
  verifyToken,
  verifyRole("landlord"),
  upload.array("images"),
  updateProperty
);

router.get("/", getProperties);
router.get("/:id", getPropertyById);
router.get(
  "/my-properties",
  verifyToken,
  verifyRole("landlord"),
  getProperties
);

// Delete property (owner-only check inside controller)
router.delete("/:id", verifyToken, verifyRole("landlord"), deleteProperty);

export default router;
