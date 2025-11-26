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
          Create Account 🏠
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Join the RentEase community
        </p>

        {/* Register Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              {...formik.getFieldProps("name")}
              className={`w-full p-3 mt-1 rounded-xl border border-gray-300
              bg-white text-gray-800
              focus:ring-2 focus:ring-green-400 focus:border-green-400
              ${
                formik.touched.name && formik.errors.name
                  ? "border-red-400"
                  : ""
              }
            `}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

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

          {/* Role Selection */}
          <RoleSelect formik={formik} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="
            w-full py-3 mt-1 rounded-xl btn-green-clean
            disabled:opacity-50 active:scale-95 transition-all
          "
          >
            {formik.isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
