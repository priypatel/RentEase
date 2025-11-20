import express from "express";
import {
  payMonthlyRent,
  getRentPaymentsByRequest,
} from "../../controllers/rentPaymentController.js";

const router = express.Router();

// Pay monthly rent
router.put("/pay/:rentId", payMonthlyRent);
// Get all rent entries for a rental request id
router.get("/by-request/:requestId", getRentPaymentsByRequest);

export default router;
