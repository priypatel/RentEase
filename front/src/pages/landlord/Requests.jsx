import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRequestsForLandlord,
  updateRequestStatus,
} from "../../redux/slices/rentalRequestSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Requests() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { landlordRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (!user) return;
    const landlordId = user._id || user.id;
    dispatch(getRequestsForLandlord(landlordId));
  }, [dispatch, user]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await dispatch(updateRequestStatus({ requestId, status })).unwrap();
      toast.success(`Request ${status}`);
      dispatch(getRequestsForLandlord(user._id || user.id));
    } catch (err) {
      toast.error(err || "Failed to update");
    }
  };

  return (
    <div className="py-0 px-0 sm:py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Rental Requests
      </h1>

      {loading && <p className="text-gray-600">Loading requests...</p>}

      {!loading && landlordRequests?.length === 0 && (
        <p className="text-gray-600 mt-3">No incoming requests yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {landlordRequests?.map((req, index) => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg bg-green-50/40"
          >
            {/* PROPERTY */}
            <div className="flex flex-col sm:flex-row gap-4">
              <img
                src={req?.propertyId?.images?.[0]?.url || "/placeholder.png"}
                className="w-full h-40 sm:w-40 sm:h-32 object-cover rounded-lg"
              />

              <div>
                <h2 className="text-lg font-semibold text-green-900">
                  {req?.propertyId?.title || "No Title"}
                </h2>

                <p className="text-gray-700">
                  {req?.propertyId?.location || "No Location"}
                </p>

                <p className="text-green-700 font-bold mt-1">
                  ₹{req?.propertyId?.rent}/month
                </p>
              </div>
            </div>

            {/* TENANT DETAILS */}
            <div className="mt-4 text-gray-800 text-sm">
              <p>
                <strong>Tenant:</strong> {req.tenantId.name}
              </p>
              <p>
                <strong>Email:</strong> {req.tenantId.email}
              </p>
              <p>
                <strong>Phone:</strong> {req.tenantId.phone}
              </p>
            </div>

            {/* STATUS TAG */}
            <div className="mt-5">
              <span
                className={`inline-flex px-4 py-1 font-medium text-xs rounded-full border
                    ${
                      req.status === "requested"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                        : req.status === "approved"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-red-50 text-red-700 border-red-300"
                    }
                    `}
              >
                {req.status.toUpperCase()}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            {req.status === "requested" && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => handleStatusUpdate(req._id, "approved")}
                  className="flex-1 glass-btn-green py-2 rounded-full text-sm font-medium"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleStatusUpdate(req._id, "rejected")}
                  className="flex-1 glass-btn-red py-2 rounded-full text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            )}

            {req.status === "approved" && (
              <p className="text-green-700 mt-4 text-sm font-medium">
                ✔ Approved — waiting for tenant deposit
              </p>
            )}

            {req.status === "rejected" && (
              <p className="text-red-700 mt-4 text-sm font-medium">
                ✘ Rejected — no further actions
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
