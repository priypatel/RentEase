import React from "react";

export default function SkeletonCardMini() {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
      {/* Image area similar to mini image height */}
      <div className="w-full h-40 bg-gray-200/70 animate-pulse" />

      {/* Content */}
      <div className="p-4">
        <div className="h-4 bg-gray-200/70 rounded w-3/5 animate-pulse" />
        <div className="mt-2 h-3 bg-gray-200/70 rounded w-1/2 animate-pulse" />
        <div className="mt-3 h-5 bg-gray-200/70 rounded w-2/5 animate-pulse" />

        <div className="flex justify-between mt-4">
          <div className="h-8 w-20 bg-gray-200/70 rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-gray-200/70 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
