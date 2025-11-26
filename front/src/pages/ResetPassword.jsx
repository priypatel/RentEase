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
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      {/* Glass Card */}
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
          Reset Password 🔐
        </h1>

        <p className="text-center text-gray-700 mb-6">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* New Password */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              New Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...formik.getFieldProps("password")}
                className={`w-full p-3 rounded-xl border border-gray-300 
                bg-white text-gray-800 pr-12
                focus:ring-2 focus:ring-green-400 focus:border-green-400
                ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400"
                    : ""
                }
              `}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 transition"
                tabIndex={-1}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="
            w-full py-3 mt-1 rounded-xl btn-green-clean
            disabled:opacity-50 active:scale-95 transition-all
          "
          >
            {formik.isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
