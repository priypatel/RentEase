import React from "react";
import { motion } from "framer-motion";

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirm",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-800">Confirm Action</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
