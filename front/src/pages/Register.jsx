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

  // ✅ Validation Schema
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

  // ✅ Submit handler
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
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500">
      <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md text-white relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Create Account 🏠
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 sm:gap-5"
        >
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              className={`input-primary ${
                formik.touched.name && formik.errors.name
                  ? "border-red-400"
                  : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-300 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

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

          {/* Password with Toggle */}
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

              {/* 👁️ Toggle button */}
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

          {/* Role Select */}
          <div className="relative z-40">
            {/* <label className="text-sm font-semibold">Role</label> */}
            {/* <select
              name="role"
              {...formik.getFieldProps("role")}
              className={`w-full mt-1 p-3 rounded-md border ${
                formik.touched.role && formik.errors.role
                  ? "border-red-400"
                  : "border-purple-300"
              } bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200`}
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select> */}
            {/* <select
              name="role"
              {...formik.getFieldProps("role")}
              className={`w-full mt-1 p-3 rounded-md border ${
                formik.touched.role && formik.errors.role
                  ? "border-red-400"
                  : "border-purple-300"
              } bg-white/10 backdrop-blur-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-300 appearance-none transition-all duration-300`}
            >
              <option value="tenant" className="text-gray-800">
                Tenant
              </option>
              <option value="landlord" className="text-gray-800">
                Landlord
              </option>
            </select> */}
            <RoleSelect formik={formik} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-3 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-white/70 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-300 hover:text-yellow-400 font-semibold underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
