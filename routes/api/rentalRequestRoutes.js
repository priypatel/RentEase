import express from "express";
import {
  createRentalRequest,
  updateRequestStatus,
  payDeposit,
  getRequestsForLandlord,
  getRentalRequestById,
} from "../../controllers/rentalRequestController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

// Step 2: Tenant requests to rent a property
router.post("/create", createRentalRequest);
router.put("/status/:requestId", updateRequestStatus);
router.put("/deposit/:requestId", payDeposit);
router.get("/landlord/:landlordId", getRequestsForLandlord);
router.get("/:requestId", verifyToken, getRentalRequestById);

export default router;
