import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirm",
}) {
  if (!show) return null;

  return (
    <div className="modal">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="modal-content"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-6 h-6 text-danger" />
          <h2 className="modal-title m-0">Confirm Action</h2>
        </div>

        {/* Message */}
        <p className="text-gray-700">{message}</p>

        {/* Actions */}
        <div className="modal-actions">
          {/* Cancel */}
          <button onClick={onClose} className="btn-neutral">
            Cancel
          </button>

          {/* Confirm */}
          <button onClick={onConfirm} className="btn-danger">
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
