import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, Users, Home, Bell, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyProperties, deleteProperty } from "../redux/slices/propertySlice";

export default function LandlordDashboard() {
  const dispatch = useDispatch();

  const {
    items: properties,
    loading,
    deleting,
  } = useSelector((state) => state.properties);

  // Fetch only existing API
  useEffect(() => {
    dispatch(getMyProperties())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  // ===============================
  // COMPUTE STATS FROM PROPERTIES
  // ===============================
  const totalProperties = properties.length;

  const monthlyIncome = properties.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );

  const activeTenants = 0; // future feature
  const pendingRents = 0; // future feature

  const statCards = [
    {
      title: "Total Properties",
      value: totalProperties,
      icon: <Home className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Active Tenants",
      value: activeTenants,
      icon: <Users className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Monthly Income",
      value: `₹${monthlyIncome}`,
      icon: <Wallet className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Pending Rents",
      value: pendingRents,
      icon: <Bell className="w-6 h-6 text-green-600" />,
    },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this property?")) return;

    try {
      await dispatch(deleteProperty(id)).unwrap();
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              🏠 Landlord Dashboard
            </h1>
            <p className="text-white/80">
              Manage your properties and rentals easily.
            </p>
          </div>

          <Link
            to="/add-property"
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-white/20 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Property
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center p-5 rounded-2xl shadow-2xl border border-green-300/20 bg-green-400/20 backdrop-blur-md"
            >
              <div className="mr-4">{stat.icon}</div>
              <div>
                <p className="text-white/85 text-sm">{stat.title}</p>
                <h2 className="text-2xl font-semibold text-white">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Properties */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Recently Added Properties
            </h3>
            <Link to="/my-properties" className="text-white/90 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-white/10 animate-pulse"
                />
              ))
            ) : properties.length === 0 ? (
              <p className="text-white/80">No properties added yet.</p>
            ) : (
              properties.slice(0, 3).map((p) => (
                <div
                  key={p._id}
                  className="bg-white/10 rounded-2xl shadow-lg overflow-hidden"
                >
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white">
                      {p.title}
                    </h4>
                    <p className="text-sm text-white/80">{p.location}</p>
                    <p className="font-semibold text-green-200 mt-2">
                      ₹{p.rent}/month
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <Link
                        to={`/edit-property/${p._id}`}
                        className="bg-white/10 text-white px-3 py-1 rounded hover:bg-white/20"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500/30 text-white px-3 py-1 rounded hover:bg-red-500/40"
                      >
                        {deleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
