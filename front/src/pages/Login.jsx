import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .max(40, "Password must be at most 40 characters long")
      .required("Password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  // ✅ Submit Handler
  async function handleLogin(values, { setSubmitting, resetForm }) {
    try {
      const res = await axiosInstance.post("/auth/login", values);
      const { token, user } = res.data;

      // ✅ Save token + user in ONE place only
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user,
          token,
        })
      );

      // ✅ Redux: send BOTH token + user
      dispatch(loginSuccess({ user, token }));

      toast.success("Login successful!");

      // Redirect based on role
      if (user.role === "tenant") navigate("/tenant/dashboard");
      else if (user.role === "landlord") navigate("/landlord/dashboard");

      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      {/* GLASS LOGIN CARD */}
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
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-700 mb-6">
          Login to continue to RentEase
        </p>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
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

          {/* LOGIN BUTTON (Your green button style) */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="
            w-full py-3 mt-1 rounded-full text-sm font-semibold
            btn-green-clean
            active:scale-95 transition-all disabled:opacity-50
          "
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-right text-sm mt-2">
          <Link
            to="/forgot-password"
            className="text-green-700 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );

  // return (
  //   <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
  //     <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md text-white">
  //       <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
  //         Welcome Back 👋
  //       </h1>

  //       {/* Login Form */}
  //       <form
  //         onSubmit={formik.handleSubmit}
  //         className="flex flex-col gap-4 sm:gap-5"
  //       >
  //         {/* Email */}
  //         <div>
  //           <label className="text-sm font-semibold">Email</label>
  //           <input
  //             type="email"
  //             name="email"
  //             {...formik.getFieldProps("email")}
  //             className={`input-primary ${
  //               formik.touched.email && formik.errors.email
  //                 ? "border-red-400"
  //                 : ""
  //             }`}
  //           />
  //           {formik.touched.email && formik.errors.email && (
  //             <p className="text-red-300 text-sm mt-1">{formik.errors.email}</p>
  //           )}
  //         </div>

  //         {/* Password with Eye Toggle */}
  //         <div className="relative">
  //           <label className="text-sm font-semibold">Password</label>
  //           <div className="relative">
  //             <input
  //               type={showPassword ? "text" : "password"}
  //               name="password"
  //               {...formik.getFieldProps("password")}
  //               className={`input-primary ${
  //                 formik.touched.password && formik.errors.password
  //                   ? "border-red-400"
  //                   : ""
  //               }`}
  //             />

  //             {/* 👁️ Eye Toggle */}
  //             <button
  //               type="button"
  //               onClick={() => setShowPassword(!showPassword)}
  //               className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white transition"
  //               tabIndex={-1}
  //             >
  //               {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
  //             </button>
  //           </div>

  //           {formik.touched.password && formik.errors.password && (
  //             <p className="text-red-300 text-sm mt-1">
  //               {formik.errors.password}
  //             </p>
  //           )}
  //         </div>

  //         {/* Submit Button */}
  //         <button
  //           type="submit"
  //           disabled={formik.isSubmitting}
  //           className="btn-primary w-full mt-3 disabled:opacity-50"
  //         >
  //           {formik.isSubmitting ? "Logging in..." : "Login"}
  //         </button>
  //       </form>
  //       <p className="text-right text-xs sm:text-sm mt-1">
  //         <Link
  //           to="/forgot-password"
  //           className="text-yellow-300 hover:text-yellow-400 font-semibold"
  //         >
  //           Forgot Password?
  //         </Link>
  //       </p>

  //       {/* Footer */}
  //       <p className="text-center text-xs sm:text-sm text-white/70 mt-6">
  //         Don’t have an account?{" "}
  //         <Link
  //           to="/register"
  //           className="text-yellow-300 hover:text-yellow-400 font-semibold underline"
  //         >
  //           Register here
  //         </Link>
  //       </p>
  //     </div>
  //   </div>
  // );
}
