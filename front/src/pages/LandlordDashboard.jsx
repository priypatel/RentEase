import React from "react";
import { motion } from "framer-motion";
import { Wallet, Users, Home, Bell, PlusCircle } from "lucide-react";

export default function LandlordDashboard() {
  const stats = [
    {
      title: "Total Properties",
      value: 12,
      icon: <Home className="w-6 h-6 text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Active Tenants",
      value: 28,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Monthly Income",
      value: "₹1.2L",
      icon: <Wallet className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-100",
    },
    {
      title: "Pending Rents",
      value: 3,
      icon: <Bell className="w-6 h-6 text-red-600" />,
      color: "bg-red-100",
    },
  ];

  const reminders = [
    { tenant: "Rahul Mehta", property: "GreenVille Apartment", dueDate: "Nov 10, 2025" },
    { tenant: "Priya Singh", property: "Orchid Heights", dueDate: "Nov 13, 2025" },
    { tenant: "Karan Patel", property: "Sunshine Residency", dueDate: "Nov 16, 2025" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-700">🏠 Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your properties, tenants, and rent collections easily.</p>
          </div>

          <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <PlusCircle className="w-5 h-5" />
            Add New Property
          </button>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center p-5 rounded-2xl shadow-md hover:shadow-lg transition ${stat.color}`}
            >
              <div className="mr-4">{stat.icon}</div>
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <h2 className="text-2xl font-semibold text-gray-800">{stat.value}</h2>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Reminders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 bg-white shadow-md rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-4">Upcoming Rent Reminders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-700">Tenant</th>
                  <th className="py-3 px-4 text-left text-gray-700">Property</th>
                  <th className="py-3 px-4 text-left text-gray-700">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((reminder, index) => (
                  <tr key={index} className="border-t hover:bg-green-50 transition">
                    <td className="py-3 px-4">{reminder.tenant}</td>
                    <td className="py-3 px-4">{reminder.property}</td>
                    <td className="py-3 px-4 text-red-600 font-medium">{reminder.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
