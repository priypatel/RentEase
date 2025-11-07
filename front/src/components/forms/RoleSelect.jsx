import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function RoleSelect({ formik }) {
  const [open, setOpen] = useState(false);
  const options = ["tenant", "landlord"];

  const handleSelect = (value) => {
    formik.setFieldValue("role", value);
    setOpen(false);
  };

  return (
    <div className="relative mt-1">
      <label className="text-sm font-semibold text-white">Role</label>

      {/* Selected Field */}
      <div
        onClick={() => setOpen(!open)}
        className={`mt-1 p-3 rounded-md border cursor-pointer flex justify-between items-center
    ${
      formik.touched.role && formik.errors.role
        ? "border-red-400"
        : "border-white/60"
    }
    bg-white/30 backdrop-blur-lg hover:bg-white/40
    text-white font-medium focus:outline-none 
    focus:ring-2 focus:ring-purple-400 transition-all duration-300
    shadow-[0_2px_8px_rgba(255,255,255,0.2)]`}
      >
        <span className="capitalize">
          {formik.values.role || "Select Role"}
        </span>
        <FaChevronDown
          className={`transition-transform duration-300 text-purple-700 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white/90 text-gray-800 rounded-md border border-purple-300 shadow-lg overflow-hidden animate-fadeIn">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2 cursor-pointer capitalize hover:bg-purple-100 transition-all ${
                formik.values.role === opt
                  ? "bg-purple-200 text-purple-800"
                  : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {/* Validation Error */}
      {formik.touched.role && formik.errors.role && (
        <p className="text-red-300 text-sm mt-1">{formik.errors.role}</p>
      )}
    </div>
  );
}
