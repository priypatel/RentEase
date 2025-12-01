import Property from "../models/Property.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createProperty = async (req, res) => {
  try {
    const { title, description, location, city, rent, tenants, status } =
      req.body;

    if (!title || !location || !rent) {
      return res.status(400).json({
        message: "title, location, and rent are required.",
      });
    }

    let uploadedImages = [];

    if (req.files?.length > 0) {
      uploadedImages = req.files.map((file) => ({
        url:
          process.env.USE_CLOUDINARY === "true"
            ? file.path
            : `${process.env.BASE_URL}/uploads/properties/${file.filename}`,
        public_id: file.filename,
      }));
    }

    const property = await Property.create({
      title,
      description,
      location,
      city,
      rent,
      status: status || "available",
      ownerId: req.user.id,
      images: uploadedImages,
      tenants: tenants || [],
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET properties (public OR owner-specific)
export const getProperties = async (req, res) => {
  try {
    let query = {};

    // If landlord is logged in and hitting /my-properties
    if (req.originalUrl.includes("my-properties")) {
      query.ownerId = req.user.id;
    }

    const properties = await Property.find(query)
      .populate("ownerId", "name email phone") // ⭐ Add this
      .sort({ createdAt: -1 });
    // const properties = await Property.find(query).sort({ createdAt: -1 });

    res.json({ properties });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

export const searchProperties = async (req, res) => {
  try {
    const { query, city, status, minRent, maxRent } = req.query;

    let filter = {};

    // 🔍 Text search for title & location (case-insensitive)
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
      ];
    }

    // 🏙️ Filter by city
    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    // 📌 Filter by status
    if (status) {
      filter.status = status;
    }

    // 💰 Rent filter
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    const properties = await Property.find(filter)
      .populate("ownerId", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ results: properties.length, properties });
  } catch (err) {
    res.status(500).json({
      message: "Failed to search properties",
      error: err.message,
    });
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
      .populate("ownerId", "name email phone")
      .populate("tenants", "name email phone");

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

    // ------------------------------
    // HANDLE REMOVED EXISTING IMAGES
    // ------------------------------
    let removedImages = req.body["removedImages[]"] || req.body.removedImages;

    if (removedImages && !Array.isArray(removedImages)) {
      removedImages = [removedImages];
    }

    if (removedImages?.length > 0) {
      for (let rid of removedImages) {
        const img = property.images.find(
          (i) => i._id == rid || i.public_id == rid
        );

        if (!img) continue;

        if (process.env.USE_CLOUDINARY === "true") {
          // delete from cloudinary
          await cloudinary.uploader.destroy(img.public_id);
        } else {
          // delete local file
          const localPath = `uploads/properties/${img.public_id}`;
          try {
            fs.unlinkSync(localPath);
          } catch (e) {
            console.log("Local file not found:", localPath);
          }
        }

        // remove from DB
        property.images = property.images.filter(
          (i) => i._id != rid && i.public_id != rid
        );
      }
    }

    // ------------------------------
    // HANDLE NEW UPLOADED IMAGES
    // ------------------------------
    if (req.files?.length > 0) {
      const newImages = req.files.map((file) => ({
        url:
          process.env.USE_CLOUDINARY === "true"
            ? file.path
            : `${process.env.BASE_URL}/uploads/properties/${file.filename}`,
        public_id: file.filename,
      }));

      property.images.push(...newImages);
    }

    // ------------------------------
    // UPDATE OTHER FIELDS
    // ------------------------------
    property.title = req.body.title || property.title;
    property.location = req.body.location || property.location;
    property.rent = req.body.rent || property.rent;
    property.description = req.body.description || property.description;
    property.city = req.body.city || property.city;
    // ⭐ NEW: Update status
    if (req.body.status) {
      property.status = req.body.status;
    }
    await property.save();

    res.json({
      message: "Property updated successfully",
      property,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete property (owner only)

export const deleteProperty = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
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

    const USE_CLOUDINARY = process.env.USE_CLOUDINARY === "true";
    const images = property.images || [];

    // ------------------------------------------
    // DELETE IMAGES FROM STORAGE (CLOUD OR LOCAL)
    // ------------------------------------------
    if (images.length > 0) {
      for (const img of images) {
        if (!img?.public_id) continue;

        if (USE_CLOUDINARY) {
          // --- CLOUDINARY DELETE ---
          try {
            await cloudinary.uploader.destroy(img.public_id, {
              invalidate: true,
            });
          } catch (err) {
            console.log("Cloudinary delete error:", img.public_id, err.message);
          }
        } else {
          // --- LOCAL FILE DELETE ---
          const localPath = `uploads/properties/${img.public_id}`;
          try {
            if (fs.existsSync(localPath)) {
              fs.unlinkSync(localPath);
            }
          } catch (err) {
            console.log("Local delete error:", localPath, err.message);
          }
        }
      }
    }

    // ------------------------------------------
    // DELETE PROPERTY DOCUMENT
    // ------------------------------------------
    await property.deleteOne();

    res.json({
      message: "Property deleted successfully",
      imageDelete: USE_CLOUDINARY
        ? "Cloudinary images deleted"
        : "Local images deleted",
    });
  } catch (err) {
    console.error("Delete Property ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
