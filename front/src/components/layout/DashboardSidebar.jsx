import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  Wrench,
  UserRound,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function DashboardSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🟢 ROLE SELECTOR (from your localStorage-loaded Redux slice)
  //   const { user } = useSelector((state) => state.user) || {};

  //   const role = user?.role; // "tenant" or "landlord"
  const { user } = useSelector((state) => state.auth) || {};
  const role = user?.role;

  // 🟩 LANDLORD MENU
  const landlordNav = [
    { name: "Dashboard", to: "/landlord/dashboard", icon: Home },
    { name: "My Properties", to: "/my-properties", icon: Building2 },
    { name: "Tenants", to: "/landlord/tenants", icon: Users },
    { name: "Payments", to: "/landlord/payments", icon: CreditCard },
    { name: "Requests", to: "/landlord/requests", icon: Wrench },
    { name: "Documents", to: "/landlord/documents", icon: FileText },
  ];

  // 🟦 TENANT MENU
  const tenantNav = [
    { name: "Dashboard", to: "/tenant/dashboard", icon: Home },
    { name: "Properties", to: "/tenant/properties", icon: Building2 },
    { name: "Payments", to: "/tenant/payments", icon: CreditCard },
    { name: "Requests", to: "/tenant/maintenance", icon: Wrench },
    { name: "Documents", to: "/tenant/documents", icon: FileText },
  ];

  // 🟠 CHOOSE MENU BASED ON ROLE
  const nav = role === "landlord" ? landlordNav : tenantNav;

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
          overflow-y-auto scrollbar-thin scrollbar-thumb-green-200
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
                <p className="text-sm text-[#28523d]">
                  {role === "landlord" ? "Landlord" : "Tenant"}
                </p>
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
                  flex items-center 
                  ${collapsed ? "justify-center" : "justify-start gap-4"} 
                  py-3 px-3 rounded-xl mb-3 transition-all cursor-pointer

                  hover:scale-[1.03] hover:-translate-y-[2px]
                  hover:shadow-lg hover:bg-white/40

                  ${
                    active
                      ? "bg-green-100/70 text-[#044f39] shadow-inner"
                      : "text-[#28523d] hover:text-[#044f39]"
                  }
                `}
              >
                <div className="w-10 h-6 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {/* Footer */}
        <div className="p-4 border-t border-white/40 mt-auto bg-white/10 backdrop-blur-xl">
          <Link
            to={`/${role}/profile`}
            className={`
      flex items-center 
      ${collapsed ? "justify-center" : "justify-start gap-4"} 
      py-3 px-3 rounded-xl text-[#28523d]
      hover:bg-white/40 hover:shadow-lg hover:scale-[1.03] transition
    `}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <UserRound className="w-6 h-6" />
            </div>
            {!collapsed && <span>Profile</span>}
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`
      flex items-center 
      ${collapsed ? "justify-center" : "justify-start gap-4"} 
      py-3 px-3 rounded-xl text-red-600 mt-2 w-full
      hover:bg-red-50 hover:shadow-lg hover:scale-[1.03] transition
    `}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

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
