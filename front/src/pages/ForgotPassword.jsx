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
          Forgot Password 🔐
        </h1>

        <p className="text-center text-gray-700 text-sm mb-6">
          Enter your registered email to receive a reset link.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Email Address
            </label>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="
            w-full py-3 mt-1 rounded-xl btn-green-clean
            disabled:opacity-50 active:scale-95 transition-all
          "
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Back to{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
