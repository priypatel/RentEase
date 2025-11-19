import React, { useState } from "react";
import TenantSidebar from "./TenantSidebar";

export default function TenantLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      {/* Sidebar */}
      <TenantSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content Area */}
      <div
        className={`flex-1 transition-all duration-300 
          ${collapsed ? "md:ml-20" : "md:ml-64 lg:ml-72"}
        `}
      >
        <main className="py-10 px-6 md:px-10">{children}</main>
      </div>
    </div>
  );
}
