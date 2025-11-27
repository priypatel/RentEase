import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicPropertyCard({ property, index }) {
  const navigate = useNavigate();

  // GET USER (if logged in)
  const user = useSelector((state) => state.auth.user);

  // HANDLE VIEW CLICK
  const handleView = () => {
    if (!user) {
      return navigate(`/login?redirect=/property/${property._id}`);
    }

    // If user logged in → redirect based on role
    navigate(`/${user.role}/property/${property._id}`);
  };

  return (
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

        {/* STATUS + VIEW BUTTON */}
        <div className="flex justify-between items-center mt-4">
          <span
            className={`px-4 py-1 text-xs font-medium rounded-full border 
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

          <button
            onClick={handleView}
            className="px-4 py-1 text-xs font-medium rounded-full glass-btn-blue flex items-center gap-1.5"
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
      </div>
    </motion.div>
  );
}
