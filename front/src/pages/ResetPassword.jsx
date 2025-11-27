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

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(30, "Password cannot exceed 30 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema,
    onSubmit: handleReset,
  });

  async function handleReset(values, { setSubmitting }) {
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, {
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
    <div className="flex items-center justify-center min-h-screen bg-app px-4">
      {/* Card */}
      <div className="card-light w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-2">
          Reset Password 🔐
        </h1>

        <p className="text-center text-grayText mb-6">
          Enter your new password below.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* New Password */}
          <div>
            <label className="label">New Password</label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                {...formik.getFieldProps("password")}
                className={`input pr-12 ${
                  formik.touched.password && formik.errors.password
                    ? "border-danger"
                    : ""
                }`}
              />

              {/* Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-grayText hover:text-gray-700 transition"
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            {formik.touched.password && formik.errors.password && (
              <p className="text-danger text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-1 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
