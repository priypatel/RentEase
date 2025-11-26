import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wallet, Users, Home, Bell, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getMyProperties } from "../../redux/slices/propertySlice";
import useCountUp from "../../hooks/useCountUp";

import PropertyCard from "../../components/property/PropertyCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function LandlordDashboardContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { items: properties, loading } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(getMyProperties());
  }, [dispatch]);

  // Stats
  const totalProperties = properties.length;
  const monthlyIncome = properties.reduce(
    (sum, p) => sum + (Number(p.rent) || 0),
    0
  );

  const statCards = [
    {
      title: "Total Properties",
      value: totalProperties,
      icon: <Home className="w-7 h-7 text-green-600" />,
      color: "bg-green-50",
    },
    {
      title: "Active Tenants",
      value: 0,
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      color: "bg-emerald-50",
    },
    {
      title: "Monthly Income",
      value: monthlyIncome,
      icon: <Wallet className="w-7 h-7 text-teal-600" />,
      color: "bg-teal-50",
      isCurrency: true,
    },
    {
      title: "Pending Rents",
      value: 0,
      icon: <Bell className="w-7 h-7 text-red-600" />,
      color: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen py-0 px-0 sm:py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Landlord Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage properties, tenants, and financials effortlessly.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Link
              to="/add-property"
              className="
                flex items-center gap-2 
                px-5 py-2.5 rounded-xl 
                glass-btn-green
                text-green-900 font-medium
                shadow-md hover:shadow-lg 
                transition-all active:scale-95
              "
            >
              <PlusCircle className="w-5 h-5 text-green-700" />
              Add Property
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md bg-white/50 backdrop-blur-xl border border-white/30 hover:bg-white/70 hover:shadow-lg active:scale-95 text-green-800"
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
                    to="/landlord/profile"
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const animatedValue = useCountUp(stat.value);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`rounded-2xl p-5 shadow-lg border border-gray-200 ${stat.color}`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white shadow-md">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h2 className="text-3xl font-semibold text-gray-900">
                      {stat.isCurrency ? `₹${animatedValue}` : animatedValue}
                    </h2>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Properties */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              Recently Added Properties
            </h3>
            <Link
              to="/my-properties"
              className="text-green-600 hover:underline font-medium"
            >
              View All →
            </Link>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : properties.length === 0 ? (
              <p className="text-gray-600">No properties found.</p>
            ) : (
              properties
                .slice(0, 3)
                .map((p, index) => (
                  <PropertyCard key={p._id} property={p} index={index} />
                ))
            )}
          </div>
        </div>

        <ConfirmModal
          show={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => navigate("/")}
          message="Are you sure you want to logout?"
          confirmText="Yes, Logout"
        />
      </motion.div>
    </div>
  );
}
