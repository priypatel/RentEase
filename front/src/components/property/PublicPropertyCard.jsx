import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicPropertyCard({ property, index }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleView = () => {
    if (!user) {
      return navigate(`/login?redirect=/property/${property._id}`);
    }
    navigate(`/${user.role}/property/${property._id}`);
  };

  return (
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
        {/* Title */}
        <h2 className="card-title">{property.title}</h2>
        <p className="card-subtitle">{property.location}</p>

        {/* Rent */}
        <p className="text-[#2ECC71] font-semibold text-lg mt-2">
          ₹{property.rent}/month
        </p>

        {/* Status + View Button */}
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

          <button onClick={handleView} className="btn-neutral">
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
      </div>
    </motion.div>
  );
}
