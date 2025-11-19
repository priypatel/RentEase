import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import ConfirmModal from "../common/ConfirmModal";

export default function TenantSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const nav = [
    { name: "Dashboard", to: "/tenant/dashboard", icon: Home },
    { name: "Properties", to: "/tenant/properties", icon: Home },
    { name: "Payments", to: "/tenant/payments", icon: CreditCard },
    { name: "Requests", to: "/tenant/maintenance", icon: Wrench },
    { name: "Documents", to: "/tenant/documents", icon: FileText },
  ];

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  return (
    <>
      <aside
        className={`
          hidden md:flex flex-col 
          ${collapsed ? "w-20" : "w-64 lg:w-72"} 
          fixed top-0 left-0 h-screen
          transition-all duration-300 z-50

          backdrop-blur-2xl 
          bg-gradient-to-b from-white/60 via-white/40 to-green-50/30
          border-r border-white/30 shadow-lg
        `}
      >
        {/* Header */}
        <div
          className={`
            flex items-center 
            ${collapsed ? "flex-col gap-2 p-4" : "justify-between p-6 pb-3"} 
          `}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/70 to-green-50/60 shadow flex items-center justify-center">
              <span className="font-semibold text-[#046c4a]">RE</span>
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-lg font-semibold text-[#044f39]">
                  RentEase
                </h1>
                <p className="text-sm text-[#28523d]">Tenant</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/30 transition"
          >
            {collapsed ? (
              <ChevronsRight className="w-6 h-6 text-[#044f39]" />
            ) : (
              <ChevronsLeft className="w-6 h-6 text-[#044f39]" />
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
                  group flex items-center gap-4 py-3 px-3 rounded-xl mb-3
                  transition-all cursor-pointer

                  hover:scale-[1.03] hover:-translate-y-[2px]
                  hover:shadow-lg hover:bg-white/40

                  ${
                    active
                      ? "bg-green-100/70 text-[#044f39] shadow-inner"
                      : "text-[#28523d] hover:text-[#044f39]"
                  }
                `}
              >
                <Icon className="w-6 h-6 transition-all group-hover:scale-110" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/40 mt-auto bg-white/10 backdrop-blur-xl">
          <Link
            to="/profile"
            className="flex items-center gap-4 py-3 px-3 rounded-xl text-[#28523d] hover:scale-[1.03] hover:-translate-y-[2px]
                  hover:shadow-lg hover:bg-white/40"
          >
            <User className="w-6 h-6" />
            {!collapsed && <span>Profile</span>}
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-4 py-3 px-3 rounded-xl text-red-600 hover:scale-[1.03] hover:-translate-y-[2px]
                  hover:shadow-lg hover:bg-red-50 transition mt-2 w-full"
          >
            <LogOut className="w-6 h-6" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ✔ GLOBAL LOGOUT CONFIRM MODAL */}
      <ConfirmModal
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
      />
    </>
  );
}
