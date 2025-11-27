import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const redirect = new URLSearchParams(location.search).get("redirect") || null;

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(40, "Password must be at most 40 characters long")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  async function handleLogin(values, { setSubmitting, resetForm }) {
    try {
      const res = await axiosInstance.post("/auth/login", values);
      const { token, user } = res.data;

      localStorage.setItem("auth", JSON.stringify({ user, token }));

      dispatch(loginSuccess({ user, token }));
      toast.success("Login successful!");

      if (redirect) {
        const propertyId = redirect.split("/property/")[1];
        if (propertyId) {
          navigate(`/${user.role}/property/${propertyId}`);
          return;
        }
      }

      if (user.role === "tenant") navigate("/");
      else if (user.role === "landlord") navigate("/landlord/dashboard");

      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-app px-4">
      {/* LOGIN CARD — now using your card-light style */}
      <div className="card-light w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-primary text-center mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-center text-grayText mb-6">
          Login to continue to RentEase
        </p>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
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

              {/* Eye Icon */}
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

          {/* LOGIN BUTTON — replaced with your btn-primary */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="btn-primary w-full mt-1"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot password */}
        <p className="text-right text-sm mt-2">
          <Link
            to="/forgot-password"
            className="text-primary font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Register */}
        <p className="text-center text-sm text-grayText mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
