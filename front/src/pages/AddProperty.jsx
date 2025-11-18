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
  } = useSelector((state) => state.properties);

  // -------------------------------
  // FORM STATES
  // -------------------------------
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // -------------------------------
  // LOAD PROPERTY IN EDIT MODE
  // -------------------------------
  useEffect(() => {
    if (id && properties.length === 0) {
      dispatch(getMyProperties());
    }
  }, [id, properties, dispatch]);

  useEffect(() => {
    if (id && properties.length > 0) {
      const p = properties.find((prop) => prop._id === id);
      if (!p) return;

      setTitle(p.title);
      setLocation(p.location);
      setRent(p.rent);
      setDescription(p.description);
      setExistingImages(p.images || []);
    }
  }, [id, properties]);

  // -------------------------------
  // IMAGE HANDLING
  // -------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

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
    formData.append("description", description);

    images.forEach((file) => formData.append("images", file));

    if (id) {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-10 px-6">
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

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-gray-700 font-semibold">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-gray-700"
            />

            {/* Existing images */}
            {id && existingImages.length > 0 && previewImages.length === 0 && (
              <div className="grid grid-cols-3 gap-4 mt-3">
                {existingImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    className="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                    alt=""
                  />
                ))}
              </div>
            )}

            {/* New previews */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-3">
                {previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    className="w-28 h-28 object-cover rounded-xl border border-gray-200 shadow-sm"
                    alt=""
                  />
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={creating || updating}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all active:scale-95"
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
