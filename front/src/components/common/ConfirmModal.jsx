import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react"; // header icon

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirm",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="
          bg-green-50 
          rounded-2xl 
          shadow-[0_6px_20px_rgba(0,0,0,0.12)]
          p-6 
          w-full max-w-sm 
          border border-green-200
        "
      >
        {/* Header with Icon */}
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-green-700" />
          <h2 className="text-xl font-semibold text-gray-900">
            Confirm Action
          </h2>
        </div>

        <p className="text-gray-700 mt-2">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="
              px-5 py-2.5 text-sm font-medium rounded-full
              glass-btn-green
            "
          >
            Cancel
          </button>

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            className="
              px-5 py-2.5 text-sm font-medium rounded-full
              glass-btn-red
            "
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
