import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import RoleSelect from "../components/forms/RoleSelect";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters long")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(40, "Password must be at most 40 characters long")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["tenant", "landlord"], "Invalid role")
      .required("Role is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", role: "tenant" },
    validationSchema,
    onSubmit: handleRegister,
  });

  async function handleRegister(values, { setSubmitting, resetForm }) {
    try {
      const res = await axiosInstance.post("/auth/register", values);
      toast.success("Registration successful!");
      resetForm();
      navigate("/login");
      console.log(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          Create Account 🏠
        </h1>
        <p className="text-center text-grayText mb-6">
          Join the RentEase community
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              className={`input mt-1 ${
                formik.touched.name && formik.errors.name ? "border-danger" : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-danger text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
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

          {/* Password */}
          <div>
            <label className="label">Password</label>
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
                className="absolute inset-y-0 right-3 flex items-center text-grayText hover:text-gray-700"
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

          {/* Role Selection (already styled in component) */}
          <RoleSelect formik={formik} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-1 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-grayText mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
