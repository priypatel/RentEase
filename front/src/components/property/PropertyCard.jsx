import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { deleteProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import PropertyDetailModal from "./PropertyDetailModal";

export default function PropertyCard({ property, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user); // ⭐ Get logged-in user

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // OPEN DELETE CONFIRM MODAL
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

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
          {/* FIRST ROW → STATUS + VIEW */}
          <div className="flex justify-between items-center mt-4">
            {/* STATUS WITH ICON */}
            <span
              className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border 
      ${
        property.status === "available"
          ? "bg-green-50 text-green-700 border-green-300"
          : property.status === "rented"
          ? "bg-red-50 text-red-700 border-red-300"
          : "bg-yellow-50 text-yellow-700 border-yellow-300"
      }
      transition-transform duration-150 ease-out hover:scale-105
    `}
            >
              {/* status icon */}
              {property.status === "available" && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {property.status === "rented" && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 6L6 18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {property.status === "pending" && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 6v6l4 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}

              {property.status?.toUpperCase()}
            </span>

            {/* VIEW BUTTON WITH ICON */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="px-4 py-1 flex items-center gap-1.5 text-xs font-medium rounded-full 
               bg-blue-50 text-blue-700 border border-blue-300 
               hover:bg-blue-100 transition-transform duration-150 ease-out hover:scale-105"
            >
              {/* eye icon */}
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

          {/* SECOND ROW → EDIT + DELETE (LANDLORD ONLY) */}
          {user?.role === "landlord" && (
            <div className="flex justify-between items-center mt-3">
              {/* EDIT BUTTON */}
              <button
                onClick={() => navigate(`/edit-property/${property._id}`)}
                className="px-4 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-full 
                 bg-green-50 text-green-700 border border-green-300 
                 hover:bg-green-100 transition-transform duration-150 ease-out hover:scale-105"
              >
                {/* pencil icon */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 3l6 6-12 12H3v-6L15 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={openDeleteModal}
                className="px-4 py-1.5 flex items-center gap-1.5 text-xs font-medium rounded-full 
                 bg-red-50 text-red-600 border border-red-300 
                 hover:bg-red-100 transition-transform duration-150 ease-out hover:scale-105"
              >
                {/* trash icon */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 6h18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 6V4h8v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6l-1 14H6L5 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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

      {/* VIEW DETAIL MODAL */}
      <PropertyDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        property={property}
      />
    </>
  );
}
