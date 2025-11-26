import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      className="
        w-[92%] mx-auto mt-6
        backdrop-blur-md bg-white/70 
        border border-white/40 shadow-sm 
        rounded-2xl px-6 py-4
        flex justify-between items-center
        z-20 relative
      "
    >
      <h1 className="text-2xl font-semibold tracking-tight">
        Rent<span className="text-[#2ECC71]">Ease</span>
      </h1>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-5 py-2 rounded-xl border border-[#2ECC71] text-[#2ECC71] hover:bg-[#e9fff2] transition"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
