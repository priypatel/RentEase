import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Validation Schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password cannot exceed 30 characters")
      .required("Password is required"),
  });

  // 🔹 Formik Setup
  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema,
    onSubmit: handleReset,
  });

  // 🔹 Submit Handler
  async function handleReset(values, { setSubmitting }) {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password: values.password,
      });

      toast.success("Password reset successful! Please login.");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Reset Password 🔐
        </h1>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* New Password */}
          <div className="relative">
            <label className="text-sm font-semibold">New Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...formik.getFieldProps("password")}
                className={`input-primary pr-12 ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400"
                    : ""
                }`}
              />

              {/* FINAL FIXED CENTERED EYE ICON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-white/70 hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-300 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-white text-purple-700 font-semibold py-3 sm:py-2.5 mt-3 rounded-md hover:bg-purple-100 transition duration-300 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
