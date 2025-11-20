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
          {/* FIRST ROW → STATUS (LEFT) + VIEW (RIGHT) */}
          <div className="flex justify-between items-center mt-4">
            {/* STATUS */}
            <span
              className={`px-4 py-1 font-medium text-xs rounded-full border 
      ${
        property.status === "available"
          ? "bg-green-50 text-green-700 border-green-300"
          : property.status === "rented"
          ? "bg-red-50 text-red-700 border-red-300"
          : "bg-yellow-50 text-yellow-700 border-yellow-300"
      }
    `}
            >
              {property.status?.toUpperCase()}
            </span>

            {/* VIEW (same style as status) */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="px-4 py-1 text-xs font-medium rounded-full 
               bg-blue-50 text-blue-700 border border-blue-300 
               hover:bg-blue-100 transition"
            >
              VIEW
            </button>
          </div>

          {/* SECOND ROW → EDIT + DELETE (LANDLORD ONLY) */}
          {user?.role === "landlord" && (
            <div className="flex justify-between items-center mt-3">
              {/* EDIT */}
              <button
                onClick={() => navigate(`/edit-property/${property._id}`)}
                className="px-4 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200 hover:bg-green-100 transition"
              >
                Edit
              </button>

              {/* DELETE */}
              <button
                onClick={openDeleteModal}
                className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition"
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

      {/* VIEW DETAIL MODAL */}
      <PropertyDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        property={property}
      />
    </>
  );
}
