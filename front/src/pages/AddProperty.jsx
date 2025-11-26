import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createProperty,
  updateProperty,
  getMyProperties,
} from "../redux/slices/propertySlice";

export default function AddProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    items: properties,
    creating,
    updating,
  } = useSelector((state) => state.properties || { items: [] });

  // -------------------------------
  // FORM STATES
  // -------------------------------
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("available");

  // NEW IMAGES
  const [images, setImages] = useState([]); // File[]
  const [previewImages, setPreviewImages] = useState([]); // [{id,url,file}]

  // EXISTING IMAGES (from DB)
  const [existingImages, setExistingImages] = useState([]); // [{_id,public_id,url}]
  const [removedExistingIds, setRemovedExistingIds] = useState([]);

  // -------------------------------
  // LOAD PROPERTY IN EDIT MODE
  // -------------------------------
  useEffect(() => {
    if (id && (!properties || properties.length === 0)) {
      dispatch(getMyProperties());
    }
  }, [id, properties, dispatch]);

  useEffect(() => {
    if (id && properties && properties.length > 0) {
      const p = properties.find((prop) => prop._id === id);
      if (!p) return;

      setTitle(p.title || "");
      setLocation(p.location || "");
      setRent(p.rent || "");
      setDescription(p.description || "");
      setExistingImages(Array.isArray(p.images) ? p.images : []);
      setStatus(p.status || "available");
    }
  }, [id, properties]);

  // -------------------------------
  // PREVIEW HELPER
  // -------------------------------
  const makePreview = (file) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url: URL.createObjectURL(file),
    file,
  });

  useEffect(() => {
    return () => {
      previewImages.forEach((p) => {
        try {
          URL.revokeObjectURL(p.url);
        } catch {}
      });
    };
  }, [previewImages]);

  // -------------------------------
  // HANDLE FILE SELECT
  // -------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((f) => makePreview(f));

    setPreviewImages((prev) => [...prev, ...previews]);
    setImages((prev) => [...prev, ...previews.map((p) => p.file)]);

    e.target.value = "";
  };

  // -------------------------------
  // REMOVE NEW PREVIEW IMAGE
  // -------------------------------
  const handleRemovePreview = (previewId) => {
    setPreviewImages((prev) => {
      const removed = prev.find((p) => p.id === previewId);
      if (removed) {
        try {
          URL.revokeObjectURL(removed.url);
        } catch {}
      }

      const updated = prev.filter((p) => p.id !== previewId);

      // sync file list
      setImages(updated.map((p) => p.file));

      return updated;
    });
  };

  // -------------------------------
  // REMOVE EXISTING IMAGE
  // -------------------------------
  const handleRemoveExisting = (identifier) => {
    setExistingImages((prev) => {
      const idx = prev.findIndex(
        (it) => it._id === identifier || it.public_id === identifier
      );
      if (idx === -1) return prev;

      const removedImage = prev[idx];
      const updated = prev.filter((_, i) => i !== idx);

      // track for backend deletion
      const removeId = removedImage._id || removedImage.public_id;
      if (removeId) {
        setRemovedExistingIds((prevIds) => [...prevIds, removeId]);
      }

      return updated;
    });
  };

  // -------------------------------
  // HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !rent) {
      toast.error("Please fill required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("rent", rent);
    formData.append("description", description || "");
    formData.append("status", status);

    images.forEach((file) => formData.append("images", file));

    if (id) {
      removedExistingIds.forEach((rid) =>
        formData.append("removedImages[]", rid)
      );

      dispatch(updateProperty({ id, formData }))
        .unwrap()
        .then(() => {
          toast.success("Property updated successfully!");
          dispatch(getMyProperties());
          navigate("/my-properties");
        })
        .catch((err) => toast.error(err || "Update failed"));
      return;
    }

    dispatch(createProperty(formData))
      .unwrap()
      .then(() => {
        toast.success("Property created successfully!");
        dispatch(getMyProperties());
        navigate("/my-properties");
      })
      .catch((err) => toast.error(err || "Create failed"));
  };

  // -------------------------------
  // UI (Option C Theme)
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-0 px-0 sm:py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* TITLE */}
          <div>
            <label className="text-gray-700 font-semibold">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="2BHK Luxury Apartment"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-gray-700 font-semibold">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ahmedabad / Area"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* RENT */}
          <div>
            <label className="text-gray-700 font-semibold">Rent (₹) *</label>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="45000"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-gray-700 font-semibold">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property..."
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          {/* STATUS */}
          {/* <div>
            <label className="text-gray-700 font-semibold">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-gray-300 bg-gray-50 
               focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </select>
          </div> */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50
               text-gray-800 focus:outline-none focus:ring-2 
               focus:ring-green-300 appearance-none"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </select>

            {/* Dropdown icon */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              ▼
            </span>
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-gray-700 font-semibold">Images</label>

            {/* Upload Box */}
            <div
              className="mt-3 border-2 border-dashed border-green-300 bg-green-50/40 rounded-2xl p-6 cursor-pointer
               flex flex-col items-center justify-center transition hover:border-green-500 hover:bg-green-50"
              onClick={() => document.getElementById("imageInput").click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16l5-6 4 5 4-3 5 6M3 4h18"
                />
              </svg>

              <p className="mt-2 text-gray-700 font-medium">
                Drag & Drop or{" "}
                <span className="text-green-600 underline">Browse Files</span>
              </p>

              <p className="text-xs text-gray-500">Upload multiple images</p>

              <input
                id="imageInput"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* EXISTING IMAGES */}
            {id && existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {existingImages.map((img, idx) => (
                  <div
                    key={img._id || img.public_id || idx}
                    className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
                  >
                    <img
                      src={img?.url || ""}
                      onError={(e) => (e.target.style.display = "none")}
                      className="w-full h-28 object-cover transition group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExisting(img._id || img.public_id)
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full
                          shadow-md opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* NEW PREVIEW IMAGES */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewImages.map((p) => (
                  <div
                    key={p.id}
                    className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200"
                  >
                    <img
                      src={p.url}
                      className="w-full h-28 object-cover transition group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePreview(p.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full
                          shadow-md opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={creating || updating}
            className="
              glass-btn-green 
              w-full py-3 rounded-xl 
              text-sm font-semibold text-green-900
              shadow-md hover:shadow-lg 
              transition-all active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {id
              ? updating
                ? "Updating..."
                : "Update Property"
              : creating
              ? "Creating..."
              : "Create Property"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
