import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, logoutUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, LogOut } from "lucide-react";
import ConfirmModal from "../components/common/ConfirmModal";
import { toast } from "react-toastify";
import Header from "../components/common/Header";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleLogoutConfirm = () => {
    dispatch(logoutUser()).then(() => navigate("/login"));
  };

  const handleSaveConfirm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone must be a 10-digit number");
      return;
    }

    dispatch(updateUserProfile({ name, email, phone })).then(() => {
      toast.success("Profile updated successfully");
    });

    setShowSaveConfirm(false);
  };

  return (
    <>
      <Header />

      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-green-100 mt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 shadow-md flex items-center justify-center border border-green-200">
            <User className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-semibold text-green-700 mt-4">
            Your Profile
          </h2>
          <p className="text-gray-500">Manage your personal details</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Full Name
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm">
              <User className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                value={name}
                className="w-full outline-none text-gray-800 bg-transparent"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm">
              <Mail className="text-gray-500 mr-2" size={20} />
              <input
                type="email"
                value={email}
                className="w-full outline-none text-gray-800 bg-transparent"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-700 font-medium">Phone</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 mt-1 shadow-sm">
              <Phone className="text-gray-500 mr-2" size={20} />
              <input
                type="text"
                value={phone}
                className="w-full outline-none text-gray-800 bg-transparent"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => setShowSaveConfirm(true)}
          disabled={loading}
          className="
            btn-primary 
            w-full mt-8 py-3 rounded-xl 
            font-semibold text-sm shadow-md
            hover:shadow-lg transition active:scale-95
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full mt-4 py-3 rounded-xl btn-danger text-sm flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* MODALS */}
      <ConfirmModal
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        message="Are you sure you want to logout?"
        confirmText="Yes, Logout"
      />
      <ConfirmModal
        show={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveConfirm}
        message="Are you sure you want to save changes?"
        confirmText="Yes, Save"
      />
    </>
  );
}
