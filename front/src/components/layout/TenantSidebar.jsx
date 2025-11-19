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
        bg-[#F4FBF6] border-r border-gray-200 
        transition-all duration-300
        ${collapsed ? "overflow-hidden" : "overflow-y-auto"}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center ${
          collapsed ? "flex-col gap-3 p-4" : "justify-between p-6 pb-3"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e0f6ea] to-[#cdeee0] flex items-center justify-center">
            <span className="font-semibold text-[#046c4a]">RE</span>
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-[#0f5132]">RentEase</h1>
              <p className="text-sm text-[#2d6b4d]">Tenant</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hover:bg-[#eaf7f0] transition ${
            collapsed ? "mt-2" : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight className="w-6 h-6 text-[#28523d]" />
          ) : (
            <ChevronsLeft className="w-6 h-6 text-[#28523d]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4">
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
                    ? "bg-[#DAF7EB] text-[#044f39]"
                    : "text-[#28523d] hover:bg-[#eaf7f0]"
                }
              `}
            >
              <Icon className="w-6 h-6" />

              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          className="flex items-center gap-4 py-3 px-3 rounded-xl text-[#28523d] hover:bg-[#eaf7f0]"
        >
          <User className="w-6 h-6" />
          {!collapsed && <span>Profile</span>}
        </Link>

        <button
          onClick={() => (window.location.href = "/logout")}
          className="flex items-center gap-4 py-3 px-3 rounded-xl text-[#b42323] hover:bg-[#feeaea] mt-3 w-full"
        >
          <LogOut className="w-6 h-6" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
