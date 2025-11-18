import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Users, Home, Bell, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { getMyProperties } from "../redux/slices/propertySlice";

import PropertyCardMini from "../components/property/PropertyCardMini";
import SkeletonCardMini from "../components/common/SkeletonCardMini";
import useCountUp from "../hooks/useCountUp";

export default function LandlordDashboard() {
  const dispatch = useDispatch();

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
      isCurrency: false,
    },
    {
      title: "Active Tenants",
      value: 0,
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      color: "bg-emerald-50",
      isCurrency: false,
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

          <Link
            to="/add-property"
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-green-700 transition-all hover:shadow-xl active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Add Property
          </Link>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCardMini key={i} />
              ))
            ) : properties.length === 0 ? (
              <p className="text-gray-600">No properties found.</p>
            ) : (
              properties
                .slice(0, 3)
                .map((p, index) => (
                  <PropertyCardMini key={p._id} property={p} index={index} />
                ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
