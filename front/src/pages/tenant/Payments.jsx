import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenantRequests } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tenantRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    dispatch(fetchTenantRequests());
  }, []);

  if (loading || !tenantRequests)
    return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-blue-900 mb-8"
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
            className="relative rounded-3xl p-5 bg-white/30 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="w-full md:w-40 h-32 overflow-hidden rounded-2xl shadow-md">
                <img
                  src={req.propertyId?.images?.[0]?.url}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-blue-900">
                  {req.propertyId?.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  📍 {req.propertyId?.location}
                </p>

                <p className="mt-2 text-green-700 font-bold text-lg">
                  ₹{req.propertyId?.rent}/month
                </p>

                {/* Status Badges */}
                <div className="mt-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-md 
                      ${
                        req.status === "requested"
                          ? "bg-yellow-200/80 text-yellow-800"
                          : req.status === "approved"
                          ? "bg-blue-200/80 text-blue-800"
                          : req.status === "rejected"
                          ? "bg-red-200/80 text-red-800"
                          : "bg-green-200/80 text-green-800"
                      }`}
                  >
                    {req.status.toUpperCase()}
                  </span>

                  {/* Deposit Badge */}
                  {req.status === "approved" && (
                    <span
                      className={`ml-3 px-3 py-1 rounded-full text-xs font-medium shadow 
                        ${
                          req.depositStatus === "paid"
                            ? "bg-green-200/80 text-green-800"
                            : "bg-orange-200/80 text-orange-800"
                        }`}
                    >
                      {req.depositStatus === "paid"
                        ? "Deposit Paid"
                        : "Deposit Pending"}
                    </span>
                  )}
                </div>
              </div>

              {/* Button */}
              <div className="flex items-center justify-center md:justify-end">
                <button
                  onClick={() => navigate(`/tenant/payments/${req._id}`)}
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm glass-btn-blue flex items-center justify-center gap-2"
                >
                  View Payments
                </button>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-white/10 to-white/0"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
