import express from "express";
import {
  createRentalRequest,
  updateRequestStatus,
  payDeposit,
  getRequestsForLandlord,
  getRentalRequestById,
  checkExistingRequest,
  getTenantRequests,
} from "../../controllers/rentalRequestController.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
const router = express.Router();

// Step 2: Tenant requests to rent a property
router.post("/create", createRentalRequest);
router.put("/status/:requestId", updateRequestStatus);
router.put("/deposit/:requestId", payDeposit);

// Step 3: Tenant checks if they have already requested this property
router.get("/check/:propertyId", verifyToken, checkExistingRequest);

router.get("/landlord/:landlordId", getRequestsForLandlord);
router.get("/:requestId", verifyToken, getRentalRequestById);
router.get("/tenant/all", verifyToken, getTenantRequests);

export default router;
