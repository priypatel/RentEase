// import React, { useState } from "react";
// import TenantSidebar from "./TenantSidebar";
// import MobileTenantSidebar from "./MobileTenantSidebar";
// import ConfirmModal from "../common/ConfirmModal";
// import { useDispatch } from "react-redux";
// import { logoutUser } from "../../redux/slices/userSlice";
// import { useNavigate } from "react-router-dom";

// export default function TenantLayout({ children }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   const handleLogout = () => setShowLogoutConfirm(true);

//   const confirmLogout = () => {
//     dispatch(logoutUser()).then(() => navigate("/login"));
//   };

//   return (
//     <div className="flex">
//       {/* Desktop Sidebar */}
//       <TenantSidebar onLogout={handleLogout} />

//       {/* Main Content */}
//       <div className="flex-1 p-6 min-h-screen bg-green-50 md:ml-64">
//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setMobileOpen(true)}
//           className="md:hidden mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
//         >
//           ☰ Menu
//         </button>

//         {children}
//       </div>

//       {/* MOBILE DRAWER SIDEBAR */}
//       <MobileTenantSidebar
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         onLogout={() => setShowLogoutConfirm(true)}
//       />

//       {/* Logout Popup */}
//       <ConfirmModal
//         show={showLogoutConfirm}
//         onClose={() => setShowLogoutConfirm(false)}
//         onConfirm={confirmLogout}
//         message="Are you sure you want to logout?"
//         confirmText="Yes, Logout"
//       />
//     </div>
//   );
// }
import React, { useState } from "react";
import TenantSidebar from "./TenantSidebar";
import MobileTenantSidebar from "./MobileTenantSidebar";
import ConfirmModal from "../common/ConfirmModal";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/userSlice";
import { Outlet, useNavigate } from "react-router-dom";

export default function TenantLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  return (
    <div className="flex">
      {/* DESKTOP SIDEBAR */}
      <TenantSidebar
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      {console.log("🚀 ~ TenantLayout ~ abc:", collapsed)}
      {/* MAIN CONTENT (Outlet here) */}
      <div
        className={`
          flex-1 p-6 min-h-screen bg-green-50 transition-all duration-300
          ${collapsed ? "md:ml-16" : "md:ml-64"}
        `}
      >
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden mb-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow"
        >
          ☰ Menu
        </button>

        {/* PAGE CONTENT */}
        <Outlet />
      </div>

      {/* MOBILE SIDEBAR */}
      <MobileTenantSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      {/* LOGOUT MODAL */}
      <ConfirmModal
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
      />
    </div>
  );
}
