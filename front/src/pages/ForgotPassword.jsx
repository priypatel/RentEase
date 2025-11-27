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
    <div className="flex items-center justify-center min-h-screen bg-app px-4">
      {/* Card */}
      <div className="card-light w-full max-w-md p-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-primary text-center mb-2">
          Forgot Password 🔐
        </h1>

        <p className="text-center text-grayText text-sm mb-6">
          Enter your registered email to receive a reset link.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              {...formik.getFieldProps("email")}
              className={`input mt-1 ${
                formik.touched.email && formik.errors.email
                  ? "border-danger"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-danger text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-1 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-grayText mt-6">
          Back to{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
