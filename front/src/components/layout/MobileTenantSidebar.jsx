// MobileTenantSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import ConfirmModal from "../common/ConfirmModal";

export default function MobileTenantSidebar({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

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
      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 z-50 md:hidden
          transition-transform duration-300 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          /* glass */
          backdrop-blur-2xl
          bg-gradient-to-b from-white/70 via-white/50 to-green-50/40
          border-r border-white/30 shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/70 to-green-50/60 shadow flex items-center justify-center">
              <span className="font-semibold text-[#046c4a]">RE</span>
            </div>
            <h1 className="text-lg font-semibold text-[#044f39]">
              Tenant Menu
            </h1>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/30"
          >
            <X className="w-6 h-6 text-[#044f39]" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-4">
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-4 p-3 rounded-xl mb-2
                  transition-all

                  hover:bg-white/40 hover:shadow-lg
                  hover:scale-[1.02]

                  ${
                    isActive(item.to)
                      ? "bg-green-100/70 text-[#044f39]"
                      : "text-[#28523d]"
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto p-4 border-t border-white/30 bg-white/10 backdrop-blur-xl">
          <Link
            to="/tenant/profile"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-4 py-3 px-3 rounded-xl text-[#28523d] hover:bg-white/30 transition"
          >
            <User className="w-6 h-6" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-4 py-3 px-3 rounded-xl text-red-600 hover:bg-red-50 transition mt-2 w-full"
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* CONFIRM LOGOUT */}
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
