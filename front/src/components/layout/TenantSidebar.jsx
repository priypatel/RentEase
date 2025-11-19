// TenantSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  User,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function TenantSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const nav = [
    { name: "Dashboard", to: "/tenant/dashboard", icon: Home },
    { name: "Properties", to: "/tenant/properties", icon: Home },
    { name: "Payments", to: "/tenant/payments", icon: CreditCard },
    { name: "Requests", to: "/tenant/maintenance", icon: Wrench },
    { name: "Documents", to: "/tenant/documents", icon: FileText },
  ];

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <aside
      className={`
        hidden md:flex flex-col 
        ${collapsed ? "w-20" : "w-64 lg:w-72"} 
        fixed top-0 left-0 h-screen 

        /* 🌟 GLASS EFFECT */
        backdrop-blur-xl bg-gradient-to-b
        from-white/40 to-[#e0f6ea]/20
        border-r border-white/20 shadow-lg

        transition-all duration-300
        ${collapsed ? "overflow-hidden" : "overflow-y-auto"}
      `}
    >
      {/* ----------------------------------- */}
      {/* Header */}
      {/* ----------------------------------- */}
      <div
        className={`
          flex items-center 
          ${collapsed ? "flex-col gap-2 p-3" : "justify-between p-6 pb-3"}
          bg-white/10 rounded-xl backdrop-blur-lg
          mx-3 mt-4
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e0f6ea] to-[#cdeee0] flex items-center justify-center shadow">
            <span className="font-semibold text-[#046c4a]">RE</span>
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-[#0f5132]">RentEase</h1>
              <p className="text-sm text-[#2d6b4d]">Tenant</p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition"
        >
          {collapsed ? (
            <ChevronsRight className="w-6 h-6 text-[#28523d]" />
          ) : (
            <ChevronsLeft className="w-6 h-6 text-[#28523d]" />
          )}
        </button>
      </div>

      {/* ----------------------------------- */}
      {/* Navigation */}
      {/* ----------------------------------- */}
      <nav className={`flex-1 px-3 ${collapsed ? "mt-3" : "mt-6"}`}>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center gap-4 py-3 px-3 rounded-xl mb-2 transition-all 
                ${
                  active
                    ? "bg-[#DAF7EB] text-[#044f39] shadow-inner"
                    : "text-[#28523d] hover:bg-white/20"
                }
              `}
            >
              <Icon className="w-6 h-6" />

              {!collapsed && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ----------------------------------- */}
      {/* Bottom Section */}
      {/* ----------------------------------- */}
      <div
        className={`border-t border-white/20 bg-white/5 backdrop-blur-xl 
          ${collapsed ? "p-3" : "p-4"} mt-auto`}
      >
        <Link
          to="/profile"
          className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-white/20 text-[#28523d]"
        >
          <User className="w-6 h-6" />
          {!collapsed && <span>Profile</span>}
        </Link>

        <button
          onClick={() => (window.location.href = "/logout")}
          className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-[#feeaea] text-[#b42323] mt-3 w-full"
        >
          <LogOut className="w-6 h-6" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
