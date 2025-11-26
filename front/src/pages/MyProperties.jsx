import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProperties } from "../redux/slices/propertySlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyCard from "../components/property/PropertyCard";
import SkeletonCard from "../components/common/SkeletonCard";

export default function MyProperties() {
  const dispatch = useDispatch();

  const { items: properties, loading } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(getMyProperties());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-0 px-0 sm:py-10 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>

          <Link
            to="/add-property"
            className="
                flex items-center gap-2 
                px-5 py-2.5 rounded-xl 
                glass-btn-green
                text-green-900 font-medium
                shadow-md hover:shadow-lg 
                transition-all active:scale-95
              "
          >
            + Add Property
          </Link>
        </div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20"
          >
            <h2 className="text-2xl font-semibold text-gray-700">
              No Properties Found
            </h2>
            <p className="text-gray-500 mt-1">
              Start adding properties to manage them here.
            </p>

            <Link
              to="/add-property"
              className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              + Add Your First Property
            </Link>
          </motion.div>
        )}

        {/* PROPERTY GRID */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {properties.map((p, index) => (
              <PropertyCard key={p._id} property={p} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
