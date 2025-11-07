import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
      const { user } = res.data;

      dispatch(loginSuccess(user));
      toast.success("Login successful!");

      if (user.role === "tenant") navigate("/tenant/dashboard");
      else if (user.role === "landlord") navigate("/landlord/dashboard");

      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        {/* Login Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 sm:gap-5"
        >
          {/* Email */}
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className={`input-primary ${
                formik.touched.email && formik.errors.email
                  ? "border-red-400"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-300 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...formik.getFieldProps("password")}
                className={`input-primary ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400"
                    : ""
                }`}
              />

              {/* 👁️ Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-red-300 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-3 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-white/70 mt-6">
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
