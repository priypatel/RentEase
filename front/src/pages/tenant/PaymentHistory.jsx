import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentPayments, payRent } from "../../redux/slices/rentSlice";
import PaymentSuccessModal from "../../components/modals/PaymentSuccessModal";
import { motion } from "framer-motion";

export default function PaymentHistory() {
  const { id: requestId } = useParams();
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const rentState =
    useSelector((state) => state.rent.byRequest[requestId]) || {};

  const { loading, error, records = [] } = rentState;

  const currentRent = useMemo(
    () => records.find((r) => r.status === "pending"),
    [records]
  );

  useEffect(() => {
    dispatch(fetchRentPayments(requestId));
  }, [dispatch, requestId]);

  const handlePay = async () => {
    try {
      const response = await dispatch(
        payRent({
          rentId: currentRent._id,
          amountPaid: currentRent.amount,
        })
      ).unwrap();

      const { currentRent: updatedRent, nextRent } = response;

      setSuccessData({
        amount: updatedRent.amount,
        month: updatedRent.month,
        nextMonth: nextRent.month,
      });

      setShowSuccess(true);

      dispatch(fetchRentPayments(requestId));
    } catch (err) {
      alert(err.message || "Payment failed");
    }
  };

  const totalPaid = records.filter((r) => r.status === "paid").length;
  const totalAmountPaid = records
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0);

  const nextDue = records.find((r) => r.status === "pending");

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
        <h3 className="text-2xl font-bold text-green-800 mb-4">Rent Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Paid */}
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 shadow">
            <p className="text-sm text-green-700">Total Months Paid</p>
            <p className="text-2xl font-bold text-green-900">{totalPaid}</p>
          </div>

          {/* Total Amount */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow">
            <p className="text-sm text-blue-700">Total Amount Paid</p>
            <p className="text-2xl font-bold text-blue-900">
              ₹{totalAmountPaid}
            </p>
          </div>

          {/* Next Due */}
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow">
            <p className="text-sm text-yellow-700">Next Due Month</p>
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

      {/* RECORDS LIST */}
      <div className="space-y-5">
        {records.map((rent, index) => (
          <motion.div
            key={rent._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`p-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/60 border 
              hover:shadow-2xl transition-all
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
              </div>

              {/* RIGHT — STATUS + BUTTON */}
              <div className="text-right flex flex-col items-end gap-2">
                {/* STATUS BADGE (same as PropertyCard) */}
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

                {/* Pay Button */}
                {rent.status === "pending" && (
                  <button
                    onClick={handlePay}
                    className="px-5 py-2 rounded-full glass-btn-green text-xs font-medium shadow-md"
                  >
                    Pay ₹{rent.amount}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        amount={successData?.amount}
        month={successData?.month}
        nextMonth={successData?.nextMonth}
        onPrint={() => window.print()}
      />
    </div>
  );
}
