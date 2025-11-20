import mongoose from "mongoose";

const rentalRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
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

    // 1️⃣ Tenant Request Status
    status: {
      type: String,
      enum: ["requested", "approved", "rejected"],
      default: "requested",
    },

    // 2️⃣ Deposit (after landlord approves)
    depositAmount: {
      type: Number, // rent * 2 (sent from frontend)
      required: true,
    },

    depositStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    depositPaidAt: {
      type: Date,
      default: null,
    },

    // 3️⃣ Rent Cycle (starts ONLY after deposit)
    rentCycleStart: {
      type: Date,
      default: null,
    },

    // 4️⃣ Aadhaar (for future)
    aadhaarFront: {
      type: String,
      default: "",
    },

    aadhaarBack: {
      type: String,
      default: "",
    },

    aadhaarStatus: {
      type: String,
      enum: ["not_submitted", "submitted", "verified", "rejected"],
      default: "not_submitted",
    },
  },
  { timestamps: true }
);

const RentalRequest = mongoose.model("RentalRequest", rentalRequestSchema);

export default RentalRequest;
