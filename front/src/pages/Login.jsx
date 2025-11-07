import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      const { user } = res.data;
      dispatch(loginSuccess(user));
      setMessage("✅ Login successful!");
      if (user.role === "tenant") navigate("/tenant/dashboard");
      else if (user.role === "landlord") navigate("/landlord/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full mt-1 p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-blue-700 font-semibold py-2 mt-3 rounded-md hover:bg-blue-100 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
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
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-300 hover:text-yellow-400 font-semibold underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}