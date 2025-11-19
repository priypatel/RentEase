import React, { useState } from "react";
import TenantSidebar from "./TenantSidebar";

export default function TenantLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <TenantSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64 lg:ml-72"
        }`}
      >
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
