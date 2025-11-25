import express from "express";
import {
  createOrder,
  verifyPayment,
  createRentOrder,
  verifyRentPayment,
} from "../../controllers/paymentController.js";

const router = express.Router();

//Deposit payment
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

//Rent monthly payment
router.post("/create-rent-order", createRentOrder);
router.post("/verify-rent-payment", verifyRentPayment);

export default router;
