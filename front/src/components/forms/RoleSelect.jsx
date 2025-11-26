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
      <label className="text-sm font-semibold text-gray-800">Role</label>

      {/* Selected Field */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          mt-1 p-3 rounded-xl border flex justify-between items-center cursor-pointer
          bg-white
          text-gray-800 font-medium
          shadow-sm
          transition-all duration-200
          hover:bg-green-50
          ${
            formik.touched.role && formik.errors.role
              ? "border-red-400"
              : "border-gray-300 focus:border-green-400 focus:ring-green-400"
          }
        `}
      >
        <span className="capitalize">
          {formik.values.role || "Select Role"}
        </span>

        <FaChevronDown
          className={`text-green-700 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="
          absolute z-50 mt-2 w-full 
          bg-white 
          text-gray-800 
          rounded-xl 
          border border-green-200 
          shadow-[0_4px_16px_rgba(0,0,0,0.15)]
          overflow-hidden
          animate-fadeIn
        "
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`
                px-4 py-2 cursor-pointer capitalize 
                transition-all
                hover:bg-green-100
                ${
                  formik.values.role === opt
                    ? "bg-green-200 text-green-800"
                    : ""
                }
              `}
            >
              {opt}
            </div>
          ))}
        </div>
      )}

      {/* Validation */}
      {formik.touched.role && formik.errors.role && (
        <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
      )}
    </div>
  );
}
