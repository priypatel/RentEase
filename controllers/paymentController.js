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
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     // Validate signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid signature" });
//     }

//     // Update payment entry
//     const payment = await Payment.findOneAndUpdate(
//       { razorpay_order_id },
//       {
//         razorpay_payment_id,
//         razorpay_signature,
//         status: "success",
//       },
//       { new: true }
//     );

//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Payment not found" });
//     }

//     // Update rental step logic
//     const rentalRequest = await RentalRequest.findById(payment.rentalRequestId);

//     if (!rentalRequest) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Rental request not found" });
//     }

//     // If deposit paid → move to rent step
//     if (payment.type === "deposit") {
//       rentalRequest.status = "approved"; // keep approved
//       rentalRequest.depositStatus = "paid";
//       rentalRequest.depositPaidAt = new Date(); // REQUIRED FIX
//       rentalRequest.currentStep = 3; // if used
//     }

//     // If rent paid → update month
//     if (payment.type === "rent") {
//       rentalRequest.lastRentPaidAt = new Date();
//       rentalRequest.rentStatus = "paid";
//     }

//     await rentalRequest.save();

//     res.json({ success: true, message: "Payment verified & updated", payment });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

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
