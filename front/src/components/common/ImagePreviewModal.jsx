import React from "react";

export default function ImagePreviewModal({ show, onClose, images, index, setIndex }) {
  if (!show || !images?.length) return null;

  const next = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
      
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white text-3xl"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={images[index].url}
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
