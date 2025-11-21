import express from "express";
import {
  createRentalRequest,
  updateRequestStatus,
  payDeposit,
  getRequestsForLandlord,
} from "../../controllers/rentalRequestController.js";

const router = express.Router();

// Step 2: Tenant requests to rent a property
router.post("/create", createRentalRequest);
router.put("/status/:requestId", updateRequestStatus);
router.put("/deposit/:requestId",payDeposit);
router.get("/landlord/:landlordId", getRequestsForLandlord);
export default router;
