import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      setMessage("✅ Registration successful!");
      setFormData({ name: "", email: "", password: "", role: "tenant" });
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account 🏠
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-700 font-semibold py-2 mt-3 rounded-md hover:bg-purple-100 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {message && (
            <p
              className={`text-center text-sm mt-2 ${
                message.startsWith("✅") ? "text-green-300" : "text-red-300"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 hover:text-yellow-400 font-semibold underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
