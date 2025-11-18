import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, logoutUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // READ USER FROM AUTH SLICE
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleUpdate = () => {
    dispatch(updateUserProfile({ name, email, phone }));
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };

  return (
    <div className="min-h-screen bg-[#ECFDF5] px-4 py-8 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border border-green-100">
        <h2 className="text-2xl font-semibold text-green-700 text-center mb-3">
          Profile Settings
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Update your personal details
        </p>

        {/* Name */}
        <label className="block mb-2 text-gray-600 font-medium">Name</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="block mb-2 text-gray-600 font-medium">Email</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Phone */}
        <label className="block mb-2 text-gray-600 font-medium">Phone</label>
        <input
          type="text"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-300"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Update Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 text-white p-3 rounded-lg font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
