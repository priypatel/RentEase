import React from "react";

export default function PaymentHistoryFullSkeleton() {
  return (
    <div className="page-container max-w-6xl mx-auto space-y-10 animate-pulse">
      {/* ===================== SUMMARY SKELETON ===================== */}
      <div className="p-6 rounded-3xl bg-white/50 backdrop-blur-xl shadow-xl border border-green-100">
        {/* Summary Header */}
        <div className="h-7 w-48 bg-gray-200/70 rounded-md mb-6"></div>

        {/* 3 Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1 */}
          <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 shadow">
            <div className="h-4 w-32 bg-gray-200/70 rounded-md mb-3"></div>
            <div className="h-7 w-10 bg-gray-200/70 rounded-md"></div>
          </div>

          {/* Box 2 */}
          <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 shadow">
            <div className="h-4 w-40 bg-gray-200/70 rounded-md mb-3"></div>
            <div className="h-7 w-24 bg-gray-200/70 rounded-md"></div>
          </div>

          {/* Box 3 */}
          <div className="p-4 rounded-xl bg-gray-100 border border-gray-200 shadow">
            <div className="h-4 w-36 bg-gray-200/70 rounded-md mb-3"></div>
            <div className="h-7 w-20 bg-gray-200/70 rounded-md mb-2"></div>
            <div className="h-4 w-28 bg-gray-200/70 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* ===================== HISTORY CARD SKELETONS ===================== */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="
              p-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/60 
              border border-gray-200
            "
          >
            <div className="flex justify-between items-start">
              {/* Left Section */}
              <div className="space-y-3 w-2/3">
                <div className="h-6 w-32 bg-gray-200/70 rounded-md"></div>
                <div className="h-5 w-28 bg-gray-200/60 rounded-md"></div>
                <div className="h-4 w-40 bg-gray-200/60 rounded-md"></div>
                <div className="h-4 w-28 bg-gray-200/60 rounded-md"></div>
              </div>

              {/* Status Badge */}
              <div className="h-7 w-20 bg-gray-200/70 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
