import React, { useState } from "react";
import { motion } from "framer-motion";
import PropertyDetailModal from "./PropertyDetailModal";

export default function TenantPropertyCard({ property, index = 0 }) {
  const [showDetailModal, setShowDetailModal] = useState(false);

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

          {/* VIEW DETAILS */}
          <div className="flex justify-center mt-5">
            <button
              onClick={() => setShowDetailModal(true)}
              className="px-6 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-200 hover:bg-blue-100 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* DETAIL MODAL */}
      <PropertyDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        property={property}
      />
    </>
  );
}
