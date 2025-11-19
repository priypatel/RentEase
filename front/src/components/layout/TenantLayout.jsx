import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TenantSidebar from "./TenantSidebar";
import MobileTenantSidebar from "./MobileTenantSidebar";

export default function TenantLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 relative">
      {/* Desktop Sidebar */}
      <TenantSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile Sidebar */}
      <MobileTenantSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Content Wrapper */}
      <div
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64 lg:ml-72"
        }`}
      >
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-3 m-4 rounded-xl bg-white/50 backdrop-blur-xl border border-white/40 shadow active:scale-95"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            className="w-6 h-6 text-green-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* PAGE CONTENT FROM ROUTES */}
        <main className="py-8 px-6 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
