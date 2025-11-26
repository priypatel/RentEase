import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentPayments } from "../../redux/slices/rentSlice";
import {
  createRentOrder,
  verifyRentPayment,
} from "../../services/paymentService";
import PaymentSuccessModal from "../../components/modals/PaymentSuccessModal";
import { motion } from "framer-motion";
import PaymentHistorySkeleton from "../../components/common/PaymentHistorySkeleton";

export default function PaymentHistory() {
  const { id: requestId } = useParams();
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const rentState =
    useSelector((state) => state.rent.byRequest?.[requestId]) || {};

  const { loading, records = [] } = rentState;

  const currentRent = useMemo(
    () => records.find((r) => r.status === "pending"),
    [records]
  );

  useEffect(() => {
    dispatch(fetchRentPayments(requestId));
  }, [dispatch, requestId]);

  // -------------------------------------------------------
  // ⭐ FINAL WORKING handlePay FUNCTION
  // -------------------------------------------------------
  const handlePay = async () => {
    try {
      if (!currentRent) return alert("No pending rent found");

      // 1️⃣ Create Razorpay Order
      const orderResp = await createRentOrder({
        rentId: currentRent._id,
        amount: currentRent.amount,
        tenantId: currentRent.tenantId?._id ?? currentRent.tenantId,
        landlordId: currentRent.landlordId?._id ?? currentRent.landlordId,
        propertyId: currentRent.propertyId?._id ?? currentRent.propertyId,
        rentalRequestId: requestId,
      });

      const data = orderResp.data;

      if (!data.success) return alert("Order creation failed");

      // 2️⃣ Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: currentRent.amount * 100,
        currency: "INR",
        name: "RentEase",
        description: `Rent payment for ${currentRent.month}`,
        order_id: data.orderId,

        handler: async function (response) {
          // 3️⃣ Verify payment
          const verifyRes = await verifyRentPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verifyRes.data.success) {
            return alert("Payment verification failed");
          }

          const { paidRent, nextRent } = verifyRes.data;

          // 4️⃣ Show success modal
          setSuccessData({
            amount: paidRent.amount,
            month: paidRent.month,
            nextMonth: nextRent.month,
          });

          setShowSuccess(true);

          // 5️⃣ Refresh rent history
          dispatch(fetchRentPayments(requestId));
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.log("Rent Pay Error:", err);
      alert("Payment failed");
    }
  };

  // -------------------------------------------------------
  // UI RENDERING
  // -------------------------------------------------------

  if (loading) return <PaymentHistorySkeleton />;

  const totalPaid = records.filter((r) => r.status === "paid").length;
  const totalAmountPaid = records
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0);

  const nextDue = records.find((r) => r.status === "pending");

  return (
    <div className="px-0 py-0 sm:px-6 sm:py-10 ">
      {/* HEADER */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        Rent Payment History
      </motion.h2>

      {/* SUMMARY CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-xl border border-green-100"
      >
        <h3 className="text-2xl font-bold text-green-800 mb-4">Rent Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 shadow">
            <p className="text-sm text-green-700">Total Months Paid</p>
            <p className="text-2xl font-bold text-green-900">{totalPaid}</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow">
            <p className="text-sm text-blue-700">Total Amount Paid</p>
            <p className="text-2xl font-bold text-blue-900">
              ₹{totalAmountPaid}
            </p>
          </div>

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

      {/* RECORD LIST */}
      <div className="space-y-5">
        {records.map((rent, index) => (
          <motion.div
            key={rent._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`p-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/60 border
              ${
                rent.status === "paid"
                  ? "border-green-300"
                  : "border-yellow-300"
              }
            `}
          >
            <div className="flex justify-between items-center">
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

              <div className="text-right flex flex-col items-end gap-2">
                <span
                  className={`px-4 py-1 text-xs rounded-full border font-medium
                  ${
                    rent.status === "paid"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-yellow-50 text-yellow-700 border-yellow-300"
                  }`}
                >
                  {rent.status.toUpperCase()}
                </span>

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

      {/* SUCCESS MODAL */}
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
