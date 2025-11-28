import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { tenantNav } from "../config/navConfig";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* HEADER */}
      <div className="w-[92%] mx-auto pt-6">
        <header
          className="
          backdrop-blur-md bg-white/70
          border border-white/40 shadow-sm
          rounded-2xl px-6 py-4
          flex justify-between items-center
        "
        >
          {/* Logo */}
          <Link to="/" onClick={() => setOpen(false)}>
            <h1 className="text-2xl font-semibold tracking-tight">
              Rent<span className="text-[#2ECC71]">Ease</span>
            </h1>
          </Link>
          {/* Public Navigation */}
          <nav className="hidden md:flex gap-2 ml-6">
            <Link
              to="/available-properties"
              className={`
      px-4 py-2 rounded-xl font-medium transition
      ${
        isActive("/available-properties")
          ? "bg-[#2ECC71] text-white shadow-sm"
          : "text-[#1A3C34] hover:bg-[#e9fff2] hover:text-[#27ae60]"
      }
    `}
            >
              Available Properties
            </Link>
          </nav>

          {/* --- Desktop Navigation (Tenant Only) --- */}
          {user?.role === "tenant" && (
            <nav className="hidden md:flex gap-2">
              {tenantNav
                .filter((item) => item.name !== "Dashboard")
                .map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`
                    px-4 py-2 rounded-xl font-medium transition
                    ${
                      isActive(item.to)
                        ? "bg-[#2ECC71] text-white shadow-sm"
                        : "text-[#1A3C34] hover:bg-[#e9fff2] hover:text-[#27ae60]"
                    }
                  `}
                  >
                    {item.name}
                  </Link>
                ))}
            </nav>
          )}

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="
                  px-5 py-2 rounded-xl bg-[#2ECC71] text-white
                  hover:bg-[#27ae60] transition
                "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                  px-5 py-2 rounded-xl border border-[#2ECC71] text-[#2ECC71]
                  hover:bg-[#e9fff2] transition
                "
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                to={`/${user.role}/profile`}
                className="
                px-5 py-2 rounded-xl bg-[#2ECC71] text-white
                hover:bg-[#27ae60] transition
              "
              >
                Profile
              </Link>
            )}
          </div>

          {/* --- Mobile Hamburger Button --- */}
          <button
            className="md:hidden text-3xl text-[#1A3C34]"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX /> : <HiMenu />}
          </button>
        </header>
      </div>

      {/* --- MOBILE MENU (Dropdown) --- */}
      {open && (
        <div
          className="
            md:hidden w-[92%] mx-auto mt-2
            bg-white/90 border border-white/40 shadow-md rounded-2xl
            px-6 py-4 flex flex-col gap-3
            animate-[fadeDown_0.25s_ease]
          "
        >
          <Link
            to="/available-properties"
            onClick={() => setOpen(false)}
            className={`
    block px-4 py-3 rounded-xl font-medium transition
    ${
      isActive("/available-properties")
        ? "bg-[#2ECC71] text-white shadow-sm"
        : "text-[#1A3C34] hover:bg-[#e9fff2] hover:text-[#27ae60]"
    }
  `}
          >
            Available Properties
          </Link>

          {/* Tenant Navigation */}
          {user?.role === "tenant" &&
            tenantNav
              .filter((item) => item.name !== "Dashboard")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`
                    block px-4 py-3 rounded-xl font-medium transition
                    ${
                      isActive(item.to)
                        ? "bg-[#2ECC71] text-white shadow-sm"
                        : "text-[#1A3C34] hover:bg-[#e9fff2] hover:text-[#27ae60]"
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="
                  px-4 py-3 rounded-xl bg-[#2ECC71] text-white 
                  hover:bg-[#27ae60] transition text-center
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="
                  px-4 py-3 rounded-xl border border-[#2ECC71] text-[#2ECC71]
                  hover:bg-[#e9fff2] transition text-center
                "
              >
                Register
              </Link>
            </>
          ) : (
            <Link
              to={`/${user.role}/profile`}
              onClick={() => setOpen(false)}
              className="
                px-4 py-3 rounded-xl bg-[#2ECC71] text-white 
                hover:bg-[#27ae60] transition text-center
              "
            >
              Profile
            </Link>
          )}
        </div>
      )}

      {/* CSS for dropdown animation */}
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
