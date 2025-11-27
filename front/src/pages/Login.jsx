import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const redirect = new URLSearchParams(location.search).get("redirect") || null;

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(40, "Password must be at most 40 characters long")
      .required("Password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  // ✅ Submit Handler
  async function handleLogin(values, { setSubmitting, resetForm }) {
    try {
      const res = await axiosInstance.post("/auth/login", values);
      const { token, user } = res.data;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user,
          token,
        })
      );

      dispatch(loginSuccess({ user, token }));

      toast.success("Login successful!");

      // ⭐ FIXED REDIRECT LOGIC
      if (redirect) {
        const propertyId = redirect.split("/property/")[1];

        if (propertyId) {
          navigate(`/${user.role}/property/${propertyId}`);
          return;
        }
      }

      // ⭐ DEFAULT REDIRECT TO DASHBOARD
      if (user.role === "tenant") navigate("/");
      else if (user.role === "landlord") navigate("/landlord/dashboard");

      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      {/* GLASS LOGIN CARD */}
      <div
        className="
        bg-white/20 backdrop-blur-md
        border border-white/40
        shadow-[0_8px_25px_rgba(0,0,0,0.12)]
        p-8 rounded-2xl w-full max-w-md
      "
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-green-700 text-center mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Login to continue to RentEase
        </p>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className={`w-full p-3 mt-1 rounded-xl border border-gray-300
              bg-white text-gray-800
              focus:ring-2 focus:ring-green-400 focus:border-green-400
              ${
                formik.touched.email && formik.errors.email
                  ? "border-red-400"
                  : ""
              }
            `}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...formik.getFieldProps("password")}
                className={`w-full p-3 rounded-xl border border-gray-300 
                bg-white text-gray-800
                focus:ring-2 focus:ring-green-400 focus:border-green-400
                ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400"
                    : ""
                }
              `}
              />

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* LOGIN BUTTON (Your green button style) */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="
            w-full py-3 mt-1 rounded-full text-sm font-semibold
            btn-green-clean
            active:scale-95 transition-all disabled:opacity-50
          "
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-right text-sm mt-2">
          <Link
            to="/forgot-password"
            className="text-green-700 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
