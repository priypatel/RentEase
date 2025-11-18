import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { deleteProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";

export default function PropertyCard({ property, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // OPEN CONFIRM MODAL
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
          <div className="flex justify-between mt-5">
            <button
              onClick={() => navigate(`/edit-property/${property._id}`)}
              className="px-4 py-1.5 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200 hover:bg-green-100 transition"
            >
              Edit
            </button>

            <button
              onClick={openDeleteModal}
              className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
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
