import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";

export default function Deposits() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { landlordRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  // Fetch landlord-approved requests
  useEffect(() => {
    if (!user) return;

    const landlordId = user._id || user.id;
    dispatch(getRequestsForLandlord(landlordId));
  }, [dispatch, user]);

  // Filter only "approved" requests
  const approvedRequests = landlordRequests?.filter(
    (r) => r.status === "approved"
  );

  return (
    <div className="py-0 px-0 sm:py-10 sm:px-6">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        Deposit Requests
      </h1>

      {/* LOADING */}
      {loading && <p className="text-gray-600">Loading deposits...</p>}

      {/* EMPTY */}
      {!loading && approvedRequests?.length === 0 && (
        <p className="text-gray-600 mt-3">No approved requests yet.</p>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvedRequests?.map((req, index) => (
          <motion.div
            key={req._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg bg-green-50/40"
          >
            {/* PROPERTY */}
            <div className="flex gap-4">
              <img
                src={req.propertyId.images?.[0]?.url}
                alt="property"
                className="w-28 h-24 rounded-xl object-cover"
              />

              <div>
                <h2 className="text-lg font-semibold text-green-900">
                  {req.propertyId.title}
                </h2>
                <p className="text-gray-700">{req.propertyId.location}</p>
                <p className="text-green-700 font-bold mt-1">
                  ₹{req.propertyId.rent}/month
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

            {/* DEPOSIT AMOUNT */}
            <div className="mt-4 text-green-900 font-medium">
              Deposit Amount:{" "}
              <span className="font-bold">₹{req.depositAmount}</span>
            </div>

            {/* DEPOSIT STATUS BADGE */}
            <div className="mt-5">
              <span
                className={`inline-flex px-4 py-1 font-medium text-xs rounded-full border
                  ${
                    req.depositStatus === "paid"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-yellow-50 text-yellow-700 border-yellow-300"
                  }`}
              >
                {req.depositStatus === "paid"
                  ? "DEPOSIT PAID"
                  : "DEPOSIT PENDING"}
              </span>
            </div>

            {/* ACTION BUTTON */}
            {/* <button className="w-full mt-5 py-2 rounded-full glass-btn-blue text-sm font-medium">
              View Details
            </button> */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
