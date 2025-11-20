import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getAllProperties } from "../redux/slices/propertySlice";
import { logoutUser } from "../redux/slices/userSlice";

import PropertyCard from "../components/property/PropertyCard";
import SkeletonCard from "../components/common/SkeletonCardMini";
import ConfirmModal from "../components/common/ConfirmModal";
import useCountUp from "../hooks/useCountUp";

// ICONS (same style as landlord)
import { Home, Wallet, CheckCircle, Clock } from "lucide-react";

export default function TenantDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const propertyState = useSelector((state) => state.properties);
  const authState = useSelector((state) => state.auth);

  const items = propertyState?.items || [];
  const loading = propertyState?.loading || false;
  const user = authState?.user || {};

  // dropdown + logout modal state
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Fetch properties
  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Handle logout
  const handleLogoutConfirm = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "";

  // ⭐ Tenant Stats (IDENTICAL structure to landlord stats)
  const statCards = [
    {
      title: "Available Properties",
      value: items.length,
      icon: <Home className="w-7 h-7 text-green-600" />,
      color: "bg-green-50",
      isCurrency: false,
    },
    {
      title: "Requests Sent",
      value: 0,
      icon: <Wallet className="w-7 h-7 text-blue-600" />,
      color: "bg-blue-50",
      isCurrency: false,
    },
    {
      title: "Approved",
      value: 0,
      icon: <CheckCircle className="w-7 h-7 text-emerald-600" />,
      color: "bg-emerald-50",
      isCurrency: false,
    },
    {
      title: "Pending",
      value: 0,
      icon: <Clock className="w-7 h-7 text-yellow-600" />,
      color: "bg-yellow-50",
      isCurrency: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* ------------------ HEADER ------------------ */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {displayName ? `${displayName}'s Dashboard` : "Dashboard"}
            </h1>

            <p className="text-gray-600 mt-1">
              {displayName
                ? `Welcome back, ${displayName}! Explore available properties.`
                : "Explore available properties and manage your rental activity."}
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 bg-white border border-green-300 text-green-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-green-50 transition-all active:scale-95"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="profile"
                  className="w-6 h-6"
                />
                <span className="font-medium">Account</span>
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border border-gray-200 p-2 z-50 animate-fadeIn">
                  <Link
                    to="/tenant/profile"
                    className="block px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 transition"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------ GLASS STATS SECTION ------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => {
            const animatedValue = useCountUp(stat.value);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="
          rounded-2xl p-6 
          shadow-lg hover:shadow-2xl 
          cursor-pointer transition-all 

          /* 🌟 GLASS EFFECT */
          backdrop-blur-xl 
          bg-gradient-to-br from-white/50 to-[#e0f6ea]/40 
          border border-white/30 
        "
              >
                <div className="flex items-center gap-5">
                  {/* Icon container — glass inner */}
                  <div
                    className="
            p-3 rounded-xl  
            shadow-md 
            bg-gradient-to-br from-white/60 to-[#f1faf5]
            border border-white/40
          "
                  >
                    {stat.icon}
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>

                    <h2 className="text-3xl font-semibold text-gray-900">
                      {stat.isCurrency ? `₹${animatedValue}` : animatedValue}
                    </h2>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ------------------ PROPERTIES ------------------ */}
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Available Properties
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items?.map((p, index) => (
              <PropertyCard key={p._id} property={p} index={index} />
            ))}
          </div>
        )}

        {/* Logout Popup */}
        <ConfirmModal
          show={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogoutConfirm}
          message="Are you sure you want to logout?"
          confirmText="Yes, Logout"
        />
      </motion.div>
    </div>
  );
}
