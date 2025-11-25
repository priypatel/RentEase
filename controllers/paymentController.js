import crypto from "crypto";
import RentPayment from "../models/RentPayment.js";
import Payment from "../models/Payment.js";
import RentalRequest from "../models/RentalRequest.js";
import { razorpayInstance } from "../config/razorpay.js";

// ----------------------------------------------------
// CREATE ORDER
// ----------------------------------------------------
export const createOrder = async (req, res) => {
  try {
    const { amount, type, tenantId, landlordId, propertyId, rentalRequestId } =
      req.body;

    // Razorpay order
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "rent_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    // Store payment entry (pending)
    await Payment.create({
      tenantId,
      landlordId,
      propertyId,
      rentalRequestId,
      type,
      amount,
      razorpay_order_id: order.id,
      status: "pending",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount,
      currency: "INR",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ----------------------------------------------------
// VERIFY PAYMENT
// ----------------------------------------------------

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // signature validation...

    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { new: true }
    );

    const rentalRequest = await RentalRequest.findById(payment.rentalRequestId);

    if (payment.type === "deposit") {
      const cycleDate = new Date();
      const monthString = `${cycleDate.getFullYear()}-${String(
        cycleDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // 1️⃣ Create FIRST month's rent entry
      await RentPayment.create({
        rentalRequestId: rentalRequest._id,
        tenantId: rentalRequest.tenantId,
        landlordId: rentalRequest.landlordId,
        propertyId: rentalRequest.propertyId,
        month: monthString,
        amount: rentalRequest.depositAmount / 2,
        status: "pending",
      });

      // 2️⃣ Update main rentalRequest
      rentalRequest.status = "approved";
      rentalRequest.depositStatus = "paid";
      rentalRequest.depositPaidAt = cycleDate;
      rentalRequest.rentCycleStart = cycleDate;
    }

    await rentalRequest.save();

    return res.json({
      success: true,
      message: "Payment verified & updated",
      payment,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// CREATE RAZORPAY ORDER FOR MONTHLY RENT
// ----------------------------------------------------
export const createRentOrder = async (req, res) => {
  try {
    const {
      rentId,
      amount,
      tenantId,
      landlordId,
      propertyId,
      rentalRequestId,
    } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "rent_" + Date.now(),
    };

    const order = await razorpayInstance.orders.create(options);

    // Store payment entry
    await Payment.create({
      tenantId,
      landlordId,
      propertyId,
      rentalRequestId,
      rentId,
      type: "rent",
      amount,
      razorpay_order_id: order.id,
      status: "pending",
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// VERIFY RENT PAYMENT
// ----------------------------------------------------
export const verifyRentPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Signature validation
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Find payment entry
    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      },
      { new: true }
    );

    if (!payment || !payment.rentId) {
      return res.status(400).json({
        success: false,
        message: "Payment.rentId missing",
      });
    }

    // Get the rent record (your original logic)
    // Fetch current rent entry using stored rentId
    const rent = await RentPayment.findById(payment.rentId);

    if (!rent) {
      return res.status(400).json({
        success: false,
        message: "Rent record not found (rentId missing in Payment)",
      });
    }

    // ---- COPY OF YOUR WORKING LOGIC ----
    rent.status = "paid";
    rent.paidAt = new Date();
    await rent.save();

    const [year, month] = rent.month.split("-").map(Number);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const nextMonthString = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;

    const nextRent = await RentPayment.create({
      rentalRequestId: rent.rentalRequestId,
      tenantId: rent.tenantId,
      landlordId: rent.landlordId,
      propertyId: rent.propertyId,
      month: nextMonthString,
      amount: rent.amount,
      status: "pending",
    });

    return res.json({
      success: true,
      message: "Rent paid & next month's rent generated",
      currentRent: rent,
      nextRent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Rent payment verification failed",
      error: error.message,
    });
  }
};
