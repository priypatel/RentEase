import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { deleteProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";

export default function PropertyCard({ property, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // DELETE PROPERTY
  const confirmDelete = async () => {
    try {
      await dispatch(deleteProperty(property._id)).unwrap();
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* IMAGE */}
        <img
          src={property.images?.[0]?.url}
          alt={property.title}
          className="w-full h-44 object-cover rounded-t-2xl"
        />

        {/* CONTENT */}
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {property.title}
          </h2>

          <p className="text-gray-600 mt-1">{property.location}</p>

          <p className="text-green-700 font-bold mt-2 text-lg">
            ₹{property.rent}/month
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between items-center mt-4">
            {/* STATUS TAG */}
            <span
              className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border 
      ${
        property.status === "available"
          ? "bg-green-50 text-green-700 border-green-300"
          : property.status === "rented"
          ? "bg-red-50 text-red-700 border-red-300"
          : "bg-yellow-50 text-yellow-700 border-yellow-300"
      }`}
            >
              {property.status?.toUpperCase()}
            </span>

            {/* VIEW PAGE BUTTON */}
            <button
              onClick={() => navigate(`/${user.role}/property/${property._id}`)}
              className="px-4 py-1 flex items-center gap-1.5 text-xs font-medium rounded-full glass-btn-blue"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </button>
          </div>

          {/* LANDLORD CONTROLS */}
          {user?.role === "landlord" && (
            <div className="flex justify-between items-center mt-3">
              <button
                onClick={() => navigate(`/edit-property/${property._id}`)}
                className="px-4 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 glass-btn-green"
              >
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                // className="px-4 py-1.5 text-xs rounded-full bg-red-50 text-red-600 border border-red-300"
                className="px-4 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 glass-btn-red"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* CONFIRM DELETE POPUP */}
      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this property?"
        confirmText="Yes, Delete"
      />
    </>
  );
}
