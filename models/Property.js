import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    rent: { type: Number, required: true },
    // 🔹 Property Status (New Field)
    status: {
      type: String,
      enum: ["available", "rented", "pending"],
      default: "available",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ], // store image URLs (Cloudinary or other)
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
