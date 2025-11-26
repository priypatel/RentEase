import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PaymentSkeletonCard from "../../components/common/PaymentSkeletonCard";

export default function LandlordPropertiesForPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const landlordId = user?.id;

  const { landlordRequests = [], loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (landlordId) dispatch(getRequestsForLandlord(landlordId));
  }, [landlordId]);

  // SHOW SKELETON IF LOADING OR DATA NOT YET LOADED
  if (loading || !landlordRequests) {
    return (
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PaymentSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="page-container max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Properties Rent Status
      </h1>

      <div className="grid gap-7">
        {landlordRequests.map((req, i) => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/70 rounded-3xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-xl hover:shadow-2xl transition"
          >
            <div className="flex flex-col sm:flex-row gap-6 p-5">
              {/* Image */}
              <div className="w-full h-40 sm:w-40 sm:h-32 rounded-xl overflow-hidden">
                <img
                  src={req.propertyId?.images?.[0]?.url}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Middle content */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {req.propertyId?.title}
                </h2>

                <p className="text-gray-600 mt-1">
                  📍 {req.propertyId?.location}
                </p>

                <p className="text-green-700 font-bold mt-2 text-lg">
                  ₹{req.propertyId?.rent}/month
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  Tenant:{" "}
                  <span className="font-bold text-green-900">
                    {req.tenantId?.name}
                  </span>
                </p>

                {/* Badges */}
                <div className="flex gap-3 mt-3">
                  {/* Deposit Status */}
                  <span
                    className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border 
                      ${
                        req.depositStatus === "paid"
                          ? "bg-green-50 text-green-700 border-green-300"
                          : "bg-yellow-50 text-yellow-700 border-yellow-300"
                      }
                    `}
                  >
                    Deposit: {req.depositStatus.toUpperCase()}
                  </span>

                  {/* Approval Status */}
                  <span
                    className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border 
                      ${
                        req.status === "approved"
                          ? "bg-green-50 text-green-700 border-green-300"
                          : req.status === "requested"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                          : "bg-red-50 text-red-700 border-red-300"
                      }
                    `}
                  >
                    {req.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Right Button */}
              <div className="flex sm:items-center mt-4 sm:mt-0">
                <button
                  onClick={() => navigate(`/landlord/payments/${req._id}`)}
                  className="
                    w-full sm:w-auto
                    px-5 py-2.5 text-sm font-medium rounded-full 
                    glass-btn-blue shadow-md hover:shadow-lg transition
                  "
                >
                  View Payments
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {landlordRequests.length === 0 && (
        <p className="text-center text-gray-600 mt-10">
          No rented properties yet.
        </p>
      )}
    </div>
  );
}
