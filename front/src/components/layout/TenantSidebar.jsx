// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home, Wallet, FileText, User, LogOut } from "lucide-react";

// export default function TenantSidebar({ onLogout }) {
//   const { pathname } = useLocation();

//   const menuItems = [
//     { name: "Dashboard", path: "/tenant/dashboard", icon: <Home size={20} /> },
//     { name: "Payments", path: "/payments", icon: <Wallet size={20} /> },
//     { name: "Requests", path: "/rent-requests", icon: <FileText size={20} /> },
//     { name: "Profile", path: "/profile", icon: <User size={20} /> },
//   ];

//   return (
//     <div className="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 shadow-sm">
//       <div className="p-5 border-b">
//         <h1 className="text-2xl font-bold text-green-700">RentEase</h1>
//       </div>

//       <div className="px-3 mt-6 space-y-1">
//         {menuItems.map((item) => (
//           <Link
//             key={item.path}
//             to={item.path}
//             className={`flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 font-medium transition-all
//               ${
//                 pathname === item.path
//                   ? "bg-green-100 text-green-700"
//                   : "hover:bg-green-50"
//               }
//             `}
//           >
//             {item.icon}
//             {item.name}
//           </Link>
//         ))}
//       </div>

//       {/* Logout Bottom */}
//       <button
//         onClick={onLogout}
//         className="absolute bottom-6 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
//       >
//         <LogOut size={20} />
//         Logout
//       </button>
//     </div>
//   );
// }

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Wallet,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TenantSidebar({ onLogout, collapsed, setCollapsed }) {
  const { pathname } = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/tenant/dashboard", icon: <Home size={20} /> },
    { name: "Payments", path: "/payments", icon: <Wallet size={20} /> },
    { name: "Requests", path: "/rent-requests", icon: <FileText size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  return (
    <div
      className={`
        hidden md:flex flex-col h-screen fixed top-0 left-0
        bg-white border-r border-gray-200 shadow-sm
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Collapse Button - ALWAYS visible */}
      <div className="flex items-center justify-end p-3 border-b">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-green-700 transition"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
        {console.log("🚀 ~ TenantSidebar ~ collapsed:", collapsed)}
      </div>

      {/* Logo ONLY when expanded */}
      {!collapsed && (
        <div className="px-5 mt-3">
          <h1 className="text-2xl font-bold text-green-700">RentEase</h1>
        </div>
      )}
      {console.log("🚀 ~ logo ~ collapsed:", collapsed)}
      {/* MENU */}
      <div className="flex-1 mt-4 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center rounded-xl font-medium transition-all
                ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3 gap-3"}
                ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "text-gray-700 hover:bg-green-50"
                }
              `}
            >
              {/* Icon */}
              <div className="text-green-700">{item.icon}</div>

              {/* Text hidden when collapsed */}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* LOGOUT BUTTON */}
      <button
        onClick={onLogout}
        className={`
          mx-3 mb-6 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-3
          ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
        `}
      >
        <LogOut size={20} />
        {!collapsed && "Logout"}
      </button>
    </div>
  );
}
