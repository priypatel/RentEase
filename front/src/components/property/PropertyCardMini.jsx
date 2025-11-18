import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { useDispatch } from "react-redux";
import {
  deleteProperty,
  getMyProperties,
} from "../../redux/slices/propertySlice";

import PropertyDetailModal from "./PropertyDetailModal"; // ⭐ Add this import

export default function PropertyCardMini({ property, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // ⭐ For details modal

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProperty(property._id)).unwrap();
      dispatch(getMyProperties());
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Image */}
        <img
          src={property.images?.[0]?.url}
          alt={property.title}
          className="w-full h-40 object-cover"
        />

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900">
            {property.title}
          </h3>

          <p className="text-gray-600 text-sm">{property.location}</p>

          <p className="text-green-700 font-bold mt-2">
            ₹{property.rent}/month
          </p>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            {/* ⭐ View Button */}
            <button
              onClick={() => setShowDetailModal(true)}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
            >
              View
            </button>

            {/* Edit */}
            <button
              onClick={() => navigate(`/edit-property/${property._id}`)}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              Edit
            </button>

            {/* Delete */}
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirm */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this property?"
        confirmText="Yes, Delete"
      />

      {/* ⭐ View Details Modal */}
      <PropertyDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        property={property}
      />
    </>
  );
}
