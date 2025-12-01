import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, MapPin, IndianRupee } from "lucide-react";

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
          {property.rent}/month
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
      </div>
    </motion.div>
  );
}
