import Property from "../models/Property.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

// Create property (landlord only, role checked in routes)
export const createProperty = async (req, res) => {
  try {
    const { title, description, location, rent, tenants } = req.body;

    if (!title || !location || !rent) {
      return res
        .status(400)
        .json({ message: "title, location, and rent are required." });
    }

    const uploadedImages =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
      })) || [];

    const property = await Property.create({
      title,
      description,
      location,
      rent,
      ownerId: req.user.id, // From JWT
      images: uploadedImages,
      tenants: tenants || [],
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all properties
// export const getProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().populate("ownerId", "name email");
//     res.json(properties);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// GET properties (public OR owner-specific)
export const getProperties = async (req, res) => {
  try {
    let query = {};

    // If landlord is logged in and hitting /my-properties
    if (req.originalUrl.includes("my-properties")) {
      query.owner = req.user.id;
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

// Get one property
export const getPropertyById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const property = await Property.findById(id)
      .populate("ownerId", "name email")
      .populate("tenants", "name email");

    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update property (owner only)
export const updateProperty = async (req, res) => {
  try {
    const id = req.params.id;

    const property = await Property.findById(id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    if (property.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can update this property" });
    }

    let newImages = [];

    // IF new images uploaded
    if (req.files?.length > 0) {
      newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // 2. Save new images
    newImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const updates = {
      ...req.body,
      ...(newImages.length > 0 && { images: newImages }),
    };

    Object.assign(property, updates);
    await property.save();

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete property (owner only)
// export const deleteProperty = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const property = await Property.findById(id);
//     if (!property)
//       return res.status(404).json({ message: "Property not found" });

//     // Owner check
//     if (property.ownerId.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Only owner can delete this property" });
//     }

//     await property.deleteOne();

//     res.json({ message: "Property deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Owner check
    if (property.ownerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only owner can delete this property" });
    }

    // Delete Cloudinary images (if any). Do in parallel and collect failures.
    const images = property.images || [];
    const failedDeletes = [];

    if (images.length > 0) {
      // Map to promises
      const deletePromises = images.map(async (img) => {
        if (!img?.public_id) return null; // nothing to delete for this image
        try {
          // invalidate to remove cached CDN versions too
          const result = await cloudinary.uploader.destroy(img.public_id, {
            invalidate: true,
          });
          // result may be { result: 'not found' } or { result: 'ok' } depending on Cloudinary response
          if (
            result.result &&
            result.result !== "ok" &&
            result.result !== "deleted"
          ) {
            // treat as a non-fatal failure but record it
            failedDeletes.push({ public_id: img.public_id, result });
          }
          return result;
        } catch (err) {
          // record failure but don't block deletion of DB
          failedDeletes.push({
            public_id: img.public_id,
            error: err.message || err,
          });
          return null;
        }
      });

      // await all deletions
      await Promise.all(deletePromises);
    }

    // Delete the property document from DB
    await property.deleteOne();

    // Construct response
    const responsePayload = { message: "Property deleted successfully" };
    if (failedDeletes.length) {
      responsePayload.cloudinaryWarnings = {
        message:
          "Some Cloudinary deletions failed. Property removed from DB regardless.",
        failures: failedDeletes,
      };
    }

    return res.json(responsePayload);
  } catch (err) {
    console.error("deleteProperty error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
