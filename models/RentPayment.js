import mongoose from "mongoose";

const rentPaymentSchema = new mongoose.Schema(
  {
    rentalRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentalRequest",
      required: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    // Rent month like "2025-01" or "2025-11"
    month: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true, // monthly rent amount
    },

    status: {
      type: String,
      enum: ["pending", "paid", "late"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Future: if you add Razorpay / Stripe
    transactionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const RentPayment = mongoose.model("RentPayment", rentPaymentSchema);

export default RentPayment;
