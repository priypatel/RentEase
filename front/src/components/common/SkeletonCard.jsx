import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      {/* Image area (same height as PropertyCard image) */}
      <div className="w-full h-44 bg-gray-200/70 animate-pulse" />

      {/* Content area */}
      <div className="p-5">
        <div className="h-5 bg-gray-200/70 rounded w-3/5 animate-pulse" />
        <div className="mt-3 h-4 bg-gray-200/70 rounded w-1/2 animate-pulse" />
        <div className="mt-4 h-6 bg-gray-200/70 rounded w-2/5 animate-pulse" />

        {/* Buttons placeholder */}
        <div className="flex justify-between mt-5">
          <div className="h-9 w-24 bg-gray-200/70 rounded-lg animate-pulse" />
          <div className="h-9 w-24 bg-gray-200/70 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
