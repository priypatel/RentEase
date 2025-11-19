// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Wallet,
//   FileText,
//   User,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// export default function TenantSidebar({ onLogout }) {
//   const { pathname } = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const menuItems = [
//     { name: "Dashboard", path: "/tenant/dashboard", icon: <Home size={20} /> },
//     { name: "Payments", path: "/payments", icon: <Wallet size={20} /> },
//     { name: "Requests", path: "/rent-requests", icon: <FileText size={20} /> },
//     { name: "Profile", path: "/profile", icon: <User size={20} /> },
//   ];

//   return (
//     <div
//       className={`hidden md:flex flex-col h-screen fixed top-0 left-0 shadow-sm border-r border-gray-200 bg-white transition-all duration-300 
//         ${collapsed ? "w-16" : "w-64"}
//       `}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-5 border-b">
//         {!collapsed && (
//           <h1 className="text-2xl font-bold text-green-700">RentEase</h1>
//         )}

//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="p-2 rounded-lg hover:bg-gray-100 text-green-700 transition"
//         >
//           {collapsed ? <ChevronRight /> : <ChevronLeft />}
//         </button>
//       </div>

//       {/* Menu */}
//       <div className="flex-1 mt-4 space-y-1">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.path;

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`
//                 flex items-center gap-3 rounded-xl transition-all font-medium
//                 ${collapsed ? "px-3 py-3 justify-center" : "px-4 py-3"}
//                 ${
//                   isActive
//                     ? collapsed
//                       ? "bg-green-100 text-green-700"
//                       : "bg-green-100 text-green-700"
//                     : "text-gray-700 hover:bg-green-50"
//                 }
//               `}
//             >
//               <div className="text-green-700">{item.icon}</div>

//               {!collapsed && <span>{item.name}</span>}
//             </Link>
//           );
//         })}
//       </div>

//       {/* Logout */}
//       <button
//         onClick={onLogout}
//         className={`
//           mb-6 mx-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center gap-3
//           ${collapsed ? "justify-center px-3 py-3" : "px-4 py-3"}
//         `}
//       >
//         <LogOut size={20} />
//         {!collapsed && <span>Logout</span>}
//       </button>
//     </div>
//   );
// }
