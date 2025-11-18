import React, { useState } from "react";
import { motion } from "framer-motion";

// ⭐ FULLSCREEN IMAGE PREVIEW MODAL ⭐
function ImagePreviewModal({ show, onClose, images, index }) {
  const [current, setCurrent] = useState(index);

  if (!show || !images) return null;

  const next = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white text-3xl"
      >
        ✕
      </button>

      {/* Full Image */}
      <img
        src={images[current].url}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
      />

      {/* Prev */}
      <button
        onClick={prev}
        className="absolute left-8 text-white text-5xl select-none"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="absolute right-8 text-white text-5xl select-none"
      >
        ›
      </button>
    </div>
  );
}

// ⭐ MAIN PROPERTY DETAIL MODAL ⭐
export default function PropertyDetailModal({ show, onClose, property }) {
  if (!show || !property) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200 relative max-h-[90vh] flex flex-col"
        >
          {/* HEADER */}
          <div className="flex justify-end p-4 bg-white rounded-t-2xl shadow-sm">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="overflow-y-auto px-6 pb-6 pt-2 flex-1">
            {/* ⭐ IMAGE SLIDER ⭐ */}
            <div className="relative w-full h-72 mb-5 overflow-hidden rounded-xl">
              {/* IMAGES */}
              <motion.div
                className="flex h-full"
                animate={{ x: `-${currentIndex * 100}%` }}
                transition={{ duration: 0.4 }}
              >
                {property.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt="property"
                    onClick={() => {
                      setShowPreview(true);
                      setCurrentIndex(i);
                    }}
                    className="w-full h-72 object-cover flex-shrink-0 rounded-xl cursor-pointer hover:opacity-90 transition"
                  />
                ))}
              </motion.div>

              {/* LEFT BUTTON */}
              {property.images?.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow"
                >
                  ‹
                </button>
              )}

              {/* RIGHT BUTTON */}
              {property.images?.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow"
                >
                  ›
                </button>
              )}

              {/* DOTS */}
              <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {property.images?.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition
                      ${i === currentIndex ? "bg-green-600" : "bg-white/70"}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-3xl font-semibold text-gray-900">
              {property.title}
            </h2>

            {/* LOCATION */}
            <p className="text-gray-600 mt-1 flex items-center text-lg">
              📍 {property.location}
            </p>

            {/* RENT */}
            <p className="text-green-700 font-bold text-xl mt-3">
              ₹{property.rent}/month
            </p>

            {/* DESCRIPTION */}
            <h3 className="text-xl font-semibold text-gray-800 mt-6">
              Description
            </h3>
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {property.description || "No description available."}
            </p>
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t bg-white rounded-b-2xl flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      {/* ⭐ FULLSCREEN PREVIEW MODAL ⭐ */}
      <ImagePreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        images={property.images}
        index={currentIndex}
      />
    </>
  );
}
