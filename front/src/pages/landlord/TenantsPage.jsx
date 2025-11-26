// src/pages/landlord/TenantsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * TenantsPage
 *
 * Landlord-facing page that lists all properties for which there are rental requests.
 * Shows tenant details alongside property info, deposit & request status and actions:
 *  - View Payments -> /landlord/payments/:requestId
 *  - View Request  -> /landlord/request/:requestId   (if you prefer a different route rename accordingly)
 *
 * Uses: rentalRequestSlice -> getRequestsForLandlord
 *
 * NOTE: This file includes a small inline skeleton to avoid depending on external skeleton files.
 * If you prefer to reuse a global skeleton component, replace <CardSkeleton /> usage with your shared skeleton.
 */

function CardSkeleton() {
  return (
    <div className="p-5 bg-white/40 rounded-3xl backdrop-blur-xl border border-gray-200 shadow animate-pulse">
      <div className="flex gap-6">
        <div className="w-36 h-28 bg-gray-200/60 rounded-xl" />
        <div className="flex-1">
          <div className="h-5 w-48 bg-gray-200/70 rounded-md mb-3" />
          <div className="h-4 w-36 bg-gray-200/60 rounded-md mb-2" />
          <div className="h-4 w-28 bg-gray-200/60 rounded-md mb-3" />
          <div className="flex gap-3 mt-2">
            <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
            <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
          </div>
        </div>
        <div className="w-28 flex items-center justify-center">
          <div className="h-10 w-28 bg-gray-200/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const landlordId = user?.id;

  const { landlordRequests = [], loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (landlordId) dispatch(getRequestsForLandlord(landlordId));
  }, [dispatch, landlordId]);

  // quick helper to format deposit text
  const depositText = (req) =>
    req.depositStatus === "paid" ? "Deposit Paid" : "Deposit Pending";

  return (
    <div className="px-0 py-0 sm:px-6 sm:py-10 max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-green-800 mb-8"
      >
        Tenants
      </motion.h1>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid gap-7">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <CardSkeleton />
            </motion.div>
          ))}
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          <div className="grid gap-7">
            {landlordRequests.map((req, i) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 bg-white/40 rounded-3xl backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full h-40 sm:w-36 sm:h-28 rounded-xl overflow-hidden">
                    <img
                      src={req.propertyId?.images?.[0]?.url}
                      alt={req.propertyId?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-green-900">
                      {req.propertyId?.title}
                    </h2>

                    <p className="text-gray-700">
                      📍 {req.propertyId?.location}
                    </p>

                    <p className="mt-2 text-green-700 font-semibold">
                      Rent: ₹{req.propertyId?.rent}
                    </p>

                    <div className="mt-3 text-sm text-gray-700">
                      <div>
                        <span className="font-medium text-gray-900">
                          Tenant:
                        </span>{" "}
                        <span className="ml-1">
                          {req.tenantId?.name || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Email:
                        </span>{" "}
                        <span className="ml-1">
                          {req.tenantId?.email || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Phone:
                        </span>{" "}
                        <span className="ml-1">
                          {req.tenantId?.phone || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="mt-3 flex gap-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          req.depositStatus === "paid"
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-yellow-50 text-yellow-700 border-yellow-300"
                        }`}
                      >
                        {depositText(req)}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          req.status === "approved"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : req.status === "requested"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                            : "bg-red-50 text-red-700 border-red-300"
                        }`}
                      >
                        {req.status?.toUpperCase()}
                      </span>

                      {/* show current rent cycle if exists */}
                      {req.rentCycleStart && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium border bg-green-50 text-green-700 border-green-300">
                          Since{" "}
                          {new Date(req.rentCycleStart).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:items-end sm:justify-between mt-4 sm:mt-0">
                    <div className="space-y-2">
                      {/* <button
                        onClick={() =>
                          navigate(`/landlord/payments/${req._id}`)
                        }
                        className="px-5 py-2 rounded-full glass-btn-blue text-sm"
                      >
                        View Payments
                      </button> */}
                    </div>

                    <div className="text-sm text-gray-500">
                      <div>
                        Listed: {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {landlordRequests.length === 0 && (
            <div className="mt-10 text-center">
              <div className="inline-block p-8 rounded-2xl bg-green-50/60 border border-green-100 shadow">
                <h3 className="text-lg font-semibold text-green-900">
                  No tenants found
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  You don't have any approved rental requests yet.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
