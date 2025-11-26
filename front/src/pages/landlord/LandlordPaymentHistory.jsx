import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentPayments } from "../../redux/slices/rentSlice";
import { motion } from "framer-motion";
import PaymentHistorySkeleton from "../../components/common/PaymentHistorySkeleton";

export default function LandlordPaymentHistory() {
  const { id: requestId } = useParams();
  const dispatch = useDispatch();

  const rentState =
    useSelector((state) => state.rent.byRequest[requestId]) || {};

  const { loading, records = [] } = rentState;

  useEffect(() => {
    if (requestId) dispatch(fetchRentPayments(requestId));
  }, [requestId]);

  const totalPaid = records.filter((r) => r.status === "paid").length;
  const totalAmountPaid = records
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0);

  const nextDue = records.find((r) => r.status === "pending");

  if (loading || !records) {
    return <PaymentHistorySkeleton />;
  }

  return (
    <div className="page-container">
      {/* HEADER */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        Rent Payment History
      </motion.h2>

      {/* SUMMARY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-xl border border-green-100"
      >
        <h3 className="text-2xl font-bold text-green-800 mb-4">Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Paid */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 shadow">
            <p className="text-sm text-green-700">Total Months Paid</p>
            <p className="text-2xl font-bold text-green-900">{totalPaid}</p>
          </div>

          {/* Total Amount */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow">
            <p className="text-sm text-blue-700">Total Amount Received</p>
            <p className="text-2xl font-bold text-blue-900">
              ₹{totalAmountPaid}
            </p>
          </div>

          {/* Next Due */}
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow">
            <p className="text-sm text-yellow-700">Next Expected Rent</p>
            <p className="text-xl font-semibold text-yellow-900">
              {nextDue ? nextDue.month : "No Pending Rent"}
            </p>

            {nextDue && (
              <p className="text-sm text-yellow-900 mt-1">
                Amount: <b>₹{nextDue.amount}</b>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* RECORD LIST */}
      <div className="space-y-5">
        {records.map((rent, index) => (
          <motion.div
            key={rent._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`p-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/60 border transition-all hover:shadow-2xl
              ${
                rent.status === "paid"
                  ? "border-green-300"
                  : "border-yellow-300"
              }
            `}
          >
            <div className="flex justify-between items-center">
              {/* LEFT */}
              <div>
                <p className="text-xl font-semibold text-green-900">
                  {rent.month}
                </p>
                <p className="text-green-700 text-lg font-medium">
                  ₹{rent.amount}
                </p>

                {rent.paidAt && (
                  <p className="text-xs text-green-800 mt-1">
                    Paid on {new Date(rent.paidAt).toLocaleDateString()}
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-1">
                  Tenant:{" "}
                  <span className="font-semibold text-green-900">
                    {rent.tenantId?.name}
                  </span>
                </p>
              </div>

              {/* RIGHT — STATUS BADGE */}
              <span
                className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border 
                ${
                  rent.status === "paid"
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-yellow-50 text-yellow-700 border-yellow-300"
                }`}
              >
                {rent.status.toUpperCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {records.length === 0 && (
        <p className="mt-10 text-center text-gray-600">
          No payment records available.
        </p>
      )}
    </div>
  );
}
