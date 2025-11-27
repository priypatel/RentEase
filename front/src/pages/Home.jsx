import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";
import Footer from "../components/Footer";
import PublicPropertyCard from "../components/property/PublicPropertyCard";

import { getAllProperties } from "../redux/slices/propertySlice"; // ✔ use existing redux

export default function Home() {
  const parallaxRef = useRef(null);
  const dispatch = useDispatch();

  // properties from redux
  const { items: properties, loading } = useSelector(
    (state) => state.properties
  );

  // Load ALL properties (same API your dashboard uses)
  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  // Parallax effect
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--scroll-y", `${window.scrollY}px`);
        frame = null;
      });
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={parallaxRef}
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#E7FFF3] via-[#F6FFF9] to-[#DFFFEA] text-[#1A3C34]"
    >
      {/* ---------------- HEADER ---------------- */}
      <Header />

      {/* ---------------- HERO SECTION ---------------- */}
      <section
        className="
          relative overflow-hidden 
          px-6 lg:px-20 py-24 mt-10
          rounded-[40px]
          mx-4 md:mx-10
          bg-gradient-to-br from-[#E7FFF3] via-[#F6FFF9] to-[#DFFFEA]
        "
      >
        {/* Floating shapes */}
        <div
          className="absolute left-10 top-6 w-36 h-36 rounded-full blur-3xl bg-[#2ECC71]/20"
          style={{ transform: "translateY(calc(var(--scroll-y) * -0.03px))" }}
        />

        <div
          className="absolute right-10 bottom-10 w-44 h-44 rounded-full blur-3xl bg-[#27AE60]/20"
          style={{ transform: "translateY(calc(var(--scroll-y) * 0.04px))" }}
        />

        <div
          className="absolute left-1/3 top-36 w-28 h-28 rounded-full blur-2xl bg-[#A2F5C3]/30"
          style={{ transform: "translateY(calc(var(--scroll-y) * -0.02px))" }}
        />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Smart Renting,
              <span className="block text-[#2ECC71] mt-2">
                Made Effortless.
              </span>
            </h2>

            <p className="mt-4 text-gray-700 text-lg">
              A modern rental platform for landlords & tenants — faster,
              cleaner, and seamless from start to finish.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-2xl text-white font-medium bg-[#2ECC71] hover:bg-[#27ae60] transition shadow-md"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-8 py-3 rounded-2xl border border-[#2ECC71] text-[#2ECC71] hover:bg-[#e9fff2] transition"
              >
                Login
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative w-full md:w-1/2 flex justify-center"
          >
            {/* Glow */}
            <div
              className="absolute w-80 h-80 rounded-full -z-10 blur-3xl bg-[#2ECC71]/30"
              style={{
                transform: "translateY(calc(var(--scroll-y) * -0.05px))",
              }}
            />

            {/* Glass card image */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-white/40 bg-white/80 backdrop-blur-sm max-w-md w-full">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80"
                alt="Property"
                className="object-cover w-full h-64"
              />
            </div>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="mt-16">
          <svg
            viewBox="0 0 1440 120"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C160,96 320,0 480,32 C640,64 800,96 960,48 C1120,0 1280,64 1440,32 L1440 120 L0 120 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ---------------- PROPERTY LIST USING REDUX ---------------- */}
      <section className="py-16 bg-white px-6 lg:px-20">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Explore Latest Properties
        </h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading properties…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {properties.map((property, i) => (
              <PublicPropertyCard
                key={property._id}
                property={property}
                index={i}
              />
            ))}

            {properties.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No properties available.
              </p>
            )}
          </div>
        )}
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="py-16 bg-white px-6 lg:px-20">
        <h3 className="text-3xl font-semibold text-center mb-12">
          Why Choose RentEase?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Easy Property Search",
              desc: "Find properties faster with filters.",
            },
            {
              title: "Smooth Rental Process",
              desc: "Track your rental journey with ease.",
            },
            {
              title: "Secure Payments",
              desc: "All rent payments with full history.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 bg-[#F6FFF9] rounded-2xl shadow-sm border border-[#D9F5E7]"
            >
              <h4 className="text-xl font-semibold">{item.title}</h4>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
