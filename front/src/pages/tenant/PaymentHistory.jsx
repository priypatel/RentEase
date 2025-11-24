import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentPayments, payRent } from "../../redux/slices/rentSlice";
import PaymentSuccessModal from "../../components/modals/PaymentSuccessModal";

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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-green-800 mb-4">
        Payment History
      </h2>

      <div className="space-y-4">
        {records.map((rent) => (
          <div
            key={rent._id}
            className="bg-white/40 backdrop-blur-md border rounded-xl p-4 shadow"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-semibold text-green-900">
                  {rent.month}
                </p>
                <p className="text-green-700">₹{rent.amount}</p>
              </div>

              <div className="text-right">
                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-lg font-semibold ${
                    rent.status === "paid"
                      ? "bg-green-300/70 text-green-900"
                      : "bg-yellow-300/70 text-yellow-900"
                  }`}
                >
                  {rent.status.toUpperCase()}
                </span>

                {/* Payment button */}
                {rent.status === "pending" && (
                  <button
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                    onClick={handlePay}
                  >
                    Pay ₹{rent.amount}
                  </button>
                )}

                {rent.paidAt && (
                  <p className="text-xs text-green-800 mt-1">
                    Paid on: {new Date(rent.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
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
