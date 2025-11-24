import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccessModal({
  show,
  onClose,
  amount,
  month,
  nextMonth,
  onPrint,
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-[90%] sm:w-[420px] border border-white/40 text-green-900"
          >
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              Payment Successful 🎉
            </h2>

            <div className="space-y-2 text-lg">
              <p>
                <b>Month Paid:</b> {month}
              </p>
              <p>
                <b>Amount:</b> ₹{amount}
              </p>
              <p>
                <b>Next Due:</b> {nextMonth}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onPrint}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl shadow-lg transition"
              >
                Print / Download Receipt
              </button>

              <button
                onClick={onClose}
                className="w-full bg-white/40 border border-green-300 py-2 rounded-xl hover:bg-white/60 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
