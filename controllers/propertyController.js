import Property from "../models/Property.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
// Create property (landlord only, role checked in routes)
// export const createProperty = async (req, res) => {
//   try {
//     const { title, description, location, rent, tenants } = req.body;

//     if (!title || !location || !rent) {
//       return res
//         .status(400)
//         .json({ message: "title, location, and rent are required." });
//     }

//     const uploadedImages =
//       req.files?.map((file) => ({
//         url: file.path,
//         public_id: file.filename,
//       })) || [];

//     const property = await Property.create({
//       title,
//       description,
//       location,
//       rent,
//       ownerId: req.user.id, // From JWT
//       images: uploadedImages,
//       tenants: tenants || [],
//     });

//     res.status(201).json(property);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

export const createProperty = async (req, res) => {
  try {
    const { title, description, location, rent, tenants } = req.body;

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
      rent,
      ownerId: req.user.id,
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
      query.ownerId = req.user.id;
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
// export const updateProperty = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const property = await Property.findById(id);
//     if (!property)
//       return res.status(404).json({ message: "Property not found" });

//     if (property.ownerId.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Only owner can update this property" });
//     }

//     // ---------- HANDLE REMOVED EXISTING IMAGES ----------
//     // comes as removedImages[] via FormData
//     let removedImages = req.body["removedImages[]"] || req.body.removedImages;

//     if (removedImages && !Array.isArray(removedImages)) {
//       removedImages = [removedImages];
//     }

//     if (removedImages?.length > 0) {
//       for (let rid of removedImages) {
//         const img = property.images.find(
//           (i) => i._id == rid || i.public_id == rid
//         );

//         if (img) {
//           // 1. Delete from Cloudinary
//           await cloudinary.uploader.destroy(img.public_id);

//           // 2. Remove from DB array
//           property.images = property.images.filter(
//             (i) => i._id != rid && i.public_id != rid
//           );
//         }
//       }
//     }

//     // ---------- HANDLE NEW UPLOADED IMAGES ----------
//     let newImages = [];
//     if (req.files?.length > 0) {
//       newImages = req.files.map((file) => ({
//         url: file.path,
//         public_id: file.filename,
//       }));

//       // Add new images to existing ones
//       property.images.push(...newImages);
//     }

//     // ---------- UPDATE OTHER FIELDS ----------
//     property.title = req.body.title || property.title;
//     property.location = req.body.location || property.location;
//     property.rent = req.body.rent || property.rent;
//     property.description = req.body.description || property.description;

//     await property.save();

//     res.json({
//       message: "Property updated successfully",
//       property,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

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

// export const deleteProperty = async (req, res) => {
//   try {
//     const id = req.params.id;

//     if (!mongoose.isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const property = await Property.findById(id);
//     if (!property) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     // Owner check
//     if (property.ownerId.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Only owner can delete this property" });
//     }

//     // Delete Cloudinary images (if any). Do in parallel and collect failures.
//     const images = property.images || [];
//     const failedDeletes = [];

//     if (images.length > 0) {
//       // Map to promises
//       const deletePromises = images.map(async (img) => {
//         if (!img?.public_id) return null; // nothing to delete for this image
//         try {
//           // invalidate to remove cached CDN versions too
//           const result = await cloudinary.uploader.destroy(img.public_id, {
//             invalidate: true,
//           });
//           // result may be { result: 'not found' } or { result: 'ok' } depending on Cloudinary response
//           if (
//             result.result &&
//             result.result !== "ok" &&
//             result.result !== "deleted"
//           ) {
//             // treat as a non-fatal failure but record it
//             failedDeletes.push({ public_id: img.public_id, result });
//           }
//           return result;
//         } catch (err) {
//           // record failure but don't block deletion of DB
//           failedDeletes.push({
//             public_id: img.public_id,
//             error: err.message || err,
//           });
//           return null;
//         }
//       });

//       // await all deletions
//       await Promise.all(deletePromises);
//     }

//     // Delete the property document from DB
//     await property.deleteOne();

//     // Construct response
//     const responsePayload = { message: "Property deleted successfully" };
//     if (failedDeletes.length) {
//       responsePayload.cloudinaryWarnings = {
//         message:
//           "Some Cloudinary deletions failed. Property removed from DB regardless.",
//         failures: failedDeletes,
//       };
//     }

//     return res.json(responsePayload);
//   } catch (err) {
//     console.error("deleteProperty error:", err);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: err.message });
//   }
// };

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
