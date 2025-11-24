import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    rentalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "RentalRequest", required: true },

    type: { type: String, enum: ["deposit", "rent"], required: true },

    amount: { type: Number, required: true },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
