import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccessModal({
  show,
  onClose,
  amount,
  month,
  nextMonth,
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="
              w-[90%] sm:w-[440px]
              bg-white
              rounded-2xl
              p-7
              shadow-[0_16px_40px_rgba(0,0,0,0.12)]
              text-slate-900
            "
          >
            {/* TITLE */}
            <h2 className="text-2xl font-bold text-center mb-6">
              Payment Successful 🎉
            </h2>

            {/* DETAILS */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Month Paid</span>
                <span className="font-semibold">{month}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold">₹{amount}</span>
              </div>

              {nextMonth && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Next Due</span>
                  <span className="font-semibold">{nextMonth}</span>
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="flex justify-center mt-5">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                PAID
              </span>
            </div>

            {/* CLOSE BUTTON */}
            <div className="mt-7">
              <button
                onClick={onClose}
                className="
                  w-full
                  py-3
                  rounded-xl
                  font-semibold
                  text-white
                  btn-primary
                "
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
