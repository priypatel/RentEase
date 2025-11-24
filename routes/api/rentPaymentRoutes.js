import express from "express";
import {
  payMonthlyRent,
  getRentPaymentsByRequest,
  getPaymentsForLandlord,
  getPaymentsSummaryForLandlord,
} from "../../controllers/rentPaymentController.js";

const router = express.Router();

// Pay monthly rent
router.put("/pay/:rentId", payMonthlyRent);
// Get all rent entries for a rental request id
router.get("/by-request/:requestId", getRentPaymentsByRequest);

// Get payments for landlord
router.get("/landlord/:landlordId", getPaymentsForLandlord);

// Get payments summary for landlord
router.get("/landlord/:landlordId/summary", getPaymentsSummaryForLandlord);

export default router;
