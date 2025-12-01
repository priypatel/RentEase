import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";
import { deleteProperty } from "../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import { IndianRupee, Home, MapPin } from "lucide-react";

export default function PropertyCard({ property, index }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const handleView = () => {
    if (!user) {
      return navigate(`/login?redirect=/property/${property._id}`);
    }
    navigate(`/${user.role}/property/${property._id}`);
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        className="card overflow-hidden"
      >
        {/* IMAGE */}
        <img
          src={property.images?.[0]?.url}
          alt={property.title}
          className="card-image"
        />

        {/* CONTENT */}
        <div className="card-body">
          {/* TITLE */}
          <div className="flex items-center gap-2 card-title">
            <Home className="w-6 h-6 text-primary" />
            <span>{property.title}</span>
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 card-subtitle mt-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center gap-2 card-subtitle mt-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{property.city}</span>
          </div>

          {/* RENT */}
          <div className="flex items-center gap-1 text-primary font-semibold text-lg mt-2">
            <IndianRupee className="w-4 h-4" />
            <span>{property.rent}/month</span>
          </div>

          {/* STATUS + VIEW BUTTON */}
          <div className="flex justify-between items-center mt-4">
            <span
              className={`badge ${
                property.status === "available"
                  ? "badge-success"
                  : property.status === "rented"
                  ? "badge-danger"
                  : "badge-warning"
              }`}
            >
              {property.status.toUpperCase()}
            </span>

            <button
              onClick={handleView}
              className="btn-secondary px-4 py-1.5 text-sm"
            >
              View
            </button>
          </div>

          {/* LANDLORD ONLY ACTIONS */}
          {user?.role === "landlord" && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => navigate(`/edit-property/${property._id}`)}
                className="btn-secondary px-4 py-1.5 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger px-4 py-1.5 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* DELETE CONFIRMATION */}
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
