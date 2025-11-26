import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenantRequests } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PaymentSkeletonCard from "../../components/common/PaymentSkeletonCard";

export default function Payments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tenantRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    dispatch(fetchTenantRequests());
  }, []);

  // SHOW SKELETON IF LOADING OR DATA NOT YET LOADED
  if (loading || !tenantRequests) {
    return (
      <div className="page-container max-w-6xl mx-auto space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PaymentSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="px-0 py-0 sm:px-6 sm:py-10 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Payments
      </motion.h1>

      <div className="grid gap-7">
        {tenantRequests.map((req, i) => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-3xl p-5 bg-white/40 backdrop-blur-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* IMAGE */}
              <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden shadow-md">
                <img
                  src={req.propertyId?.images?.[0]?.url}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {req.propertyId?.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  📍 {req.propertyId?.location}
                </p>

                <p className="mt-2 text-green-700 font-bold text-lg">
                  ₹{req.propertyId?.rent}/month
                </p>

                {/* BADGES */}
                <div className="mt-3 flex flex-wrap gap-3">
                  {/* MAIN STATUS */}
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border 
                      ${
                        req.status === "requested"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                          : req.status === "approved"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : req.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-300"
                          : "bg-green-50 text-green-700 border-green-300"
                      }
                    `}
                  >
                    {req.status.toUpperCase()}
                  </span>

                  {/* DEPOSIT STATUS */}
                  {req.status === "approved" && (
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border 
                        ${
                          req.depositStatus === "paid"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-orange-50 text-orange-700 border-orange-300"
                        }
                      `}
                    >
                      {req.depositStatus === "paid"
                        ? "Deposit Paid"
                        : "Deposit Pending"}
                    </span>
                  )}

                  {/* RENT DUE */}
                  {req.depositStatus === "paid" && (
                    <span className="px-4 py-1.5 rounded-full text-xs font-medium border bg-yellow-50 text-yellow-700 border-yellow-300">
                      Pending 1
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex items-center justify-center md:justify-end">
                <button
                  onClick={() => navigate(`/tenant/payments/${req._id}`)}
                  className="mt-4 md:mt-0 px-5 py-2.5 rounded-full text-xs font-medium glass-btn-blue"
                >
                  View Payments
                </button>
              </div>
            </div>

            {/* GLOW */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-white/10 to-transparent"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
