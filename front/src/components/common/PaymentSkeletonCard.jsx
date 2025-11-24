// src/components/common/PaymentSkeletonCard.jsx
import React from "react";

export default function PaymentSkeletonCard() {
  return (
    <div className="rounded-3xl p-5 bg-white/40 backdrop-blur-xl border border-gray-200 shadow-lg animate-pulse">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Image skeleton */}
        <div className="w-full md:w-40 h-32 rounded-2xl bg-gray-200/60"></div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div className="h-5 w-40 bg-gray-200/70 rounded-md"></div>
          <div className="h-4 w-28 bg-gray-200/60 rounded-md"></div>
          <div className="h-5 w-32 bg-gray-200/70 rounded-md mt-2"></div>

          {/* Badges */}
          <div className="flex gap-3 mt-3">
            <div className="h-6 w-24 bg-gray-200/70 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-200/70 rounded-full"></div>
          </div>
        </div>

        {/* Button */}
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
          <div className="h-10 w-28 bg-gray-200/70 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
