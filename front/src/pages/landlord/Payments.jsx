import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentsForLandlord,
  getPaymentsSummary,
} from "../../redux/slices/rentSlice";
import { motion } from "framer-motion";

export default function Payments() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const landlordId = user?.id;

  const { landlordPayments = [], landlordSummary } = useSelector(
    (state) => state.rent
  );

  useEffect(() => {
    if (landlordId) {
      dispatch(getPaymentsForLandlord(landlordId));
      dispatch(getPaymentsSummary(landlordId));
    }
  }, [landlordId]);

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      {/* PAGE TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-green-800 mb-8"
      >
        Rent Payments Overview
      </motion.h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-green-50/70 rounded-2xl border border-green-200 shadow backdrop-blur-xl">
          <p className="text-green-700 text-sm">Total Income</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            ₹{landlordSummary?.totalIncome || 0}
          </p>
        </div>

        <div className="p-6 bg-yellow-50/70 rounded-2xl border border-yellow-200 shadow backdrop-blur-xl">
          <p className="text-yellow-700 text-sm">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {landlordSummary?.pendingCount || 0}
          </p>
        </div>

        <div className="p-6 bg-blue-50/70 rounded-2xl border border-blue-200 shadow backdrop-blur-xl">
          <p className="text-blue-700 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {landlordSummary?.totalRecords || 0}
          </p>
        </div>
      </div>

      {/* PAYMENT LIST */}
      <div className="space-y-6">
        {landlordPayments.map((payment, i) => (
          <motion.div
            key={payment._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-5 bg-white/40 border border-white/50 rounded-2xl shadow-lg backdrop-blur-xl 
                       flex justify-between items-center hover:shadow-2xl transition-all"
          >
            {/* LEFT */}
            <div>
              <p className="text-lg font-semibold text-green-900">
                {payment.propertyId?.title}
              </p>
              <p className="text-gray-700">📍 {payment.propertyId?.location}</p>
              <p className="text-sm mt-2">
                👤 Tenant:{" "}
                <span className="font-medium text-green-900">
                  {payment.tenantId?.name}
                </span>
              </p>
              <p className="text-sm text-gray-700">Month: {payment.month}</p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-xl font-bold text-green-900">
                ₹{payment.amount}
              </p>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium mt-2 inline-block 
                  ${
                    payment.status === "paid"
                      ? "bg-green-200/80 text-green-900"
                      : "bg-yellow-200/80 text-yellow-900"
                  }
                `}
              >
                {payment.status.toUpperCase()}
              </span>

              {payment.paidAt && (
                <p className="text-xs text-green-800 mt-1">
                  Paid on {new Date(payment.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {landlordPayments.length === 0 && (
          <p className="text-gray-600 text-center mt-10">
            No rent payments found yet.
          </p>
        )}
      </div>
    </div>
  );
}
