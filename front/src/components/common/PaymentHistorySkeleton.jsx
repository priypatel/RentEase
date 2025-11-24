import React from "react";

export default function PaymentHistorySkeleton() {
  return (
    <div
      className="
        p-5 rounded-2xl shadow-lg backdrop-blur-xl bg-white/50 
        border border-gray-200 animate-pulse
      "
    >
      <div className="flex justify-between items-start">
        
        {/* LEFT SECTION */}
        <div className="space-y-3 w-2/3">
          {/* Month */}
          <div className="h-6 w-32 bg-gray-200/70 rounded-md"></div>

          {/* Amount */}
          <div className="h-5 w-24 bg-gray-200/60 rounded-md"></div>

          {/* Paid on */}
          <div className="h-4 w-40 bg-gray-200/60 rounded-md mt-1"></div>

          {/* Tenant */}
          <div className="h-4 w-32 bg-gray-200/60 rounded-md"></div>
        </div>

        {/* RIGHT – STATUS BADGE */}
        <div>
          <div
            className="
              h-7 w-20 rounded-full 
              bg-gray-200/70 
            "
          ></div>
        </div>
      </div>
    </div>
  );
}
