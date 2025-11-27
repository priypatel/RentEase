// import React from "react";
// import { Link } from "react-router-dom";

// export default function Header() {
//   return (
//     <header
//       className="
//         w-[92%] mx-auto mt-6
//         backdrop-blur-md bg-white/70
//         border border-white/40 shadow-sm
//         rounded-2xl px-6 py-4
//         flex justify-between items-center
//         z-20 relative
//       "
//     >
//       <h1 className="text-2xl font-semibold tracking-tight">
//         Rent<span className="text-[#2ECC71]">Ease</span>
//       </h1>

//       <div className="flex gap-4">
//         <Link
//           to="/login"
//           className="px-5 py-2 rounded-xl bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
//         >
//           Login
//         </Link>

//         <Link
//           to="/register"
//           className="px-5 py-2 rounded-xl border border-[#2ECC71] text-[#2ECC71] hover:bg-[#e9fff2] transition"
//         >
//           Register
//         </Link>
//       </div>
//     </header>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { tenantNav } from "../config/navConfig";

export default function Header() {
  const user = useSelector((state) => state.auth.user);

  return (
    <header
      className="
        w-[92%] mx-auto mt-6
        backdrop-blur-md bg-white/70 
        border border-white/40 shadow-sm 
        rounded-2xl px-6 py-4
        flex justify-between items-center
      "
    >
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-semibold tracking-tight">
          Rent<span className="text-[#2ECC71]">Ease</span>
        </h1>
      </Link>

      {/* NAVIGATION (Tenant Only) */}
      {user?.role === "tenant" && (
        <nav className="hidden md:flex gap-6">
          {tenantNav
            .filter((item) => item.name !== "Dashboard") // remove dashboard
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-[#1A3C34] hover:text-[#2ECC71] font-medium"
              >
                {item.name}
              </Link>
            ))}
        </nav>
      )}

      {/* Right side buttons */}
      <div className="flex gap-4">
        {!user ? (
          <>
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
          </>
        ) : (
          <Link
            to={`/${user.role}/profile`}
            className="px-5 py-2 rounded-xl bg-[#2ECC71]/20 text-[#2ECC71] hover:bg-[#2ECC71]/30 transition"
          >
            Profile
          </Link>
        )}
      </div>
    </header>
  );
}
