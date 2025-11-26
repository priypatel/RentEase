import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: handleForgot,
  });

  async function handleForgot(values, { setSubmitting, resetForm }) {
    try {
      await axiosInstance.post("/auth/forgot-password", values);
      toast.success("Password reset link sent to your email!");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Forgot Password 🔐
        </h1>

        <p className="text-white/80 text-center text-sm mb-4">
          Enter your registered email to receive a password reset link.
        </p>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 sm:gap-5"
        >
          <div>
            <label className="text-sm font-semibold">Email Address</label>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-2 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-white/70 mt-6">
          Back to{" "}
          <Link
            to="/"
            className="text-yellow-300 hover:text-yellow-400 font-semibold underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
