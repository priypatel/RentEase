import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import PublicPropertyCard from "../components/property/PublicPropertyCard";
import { getAllProperties } from "../redux/slices/propertySlice";

export default function Home() {
  const dispatch = useDispatch();

  const { items: properties, loading } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* WRAPPER: Used opacity /10 for the light theme background */}
      <div className="bg-gradient-to-b from-[#2ECC71]/10 to-white">
        <Header />

        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-6 pb-20 px-6 overflow-hidden">
          {/* Background Decorative Blob: Used opacity /20 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#2ECC71]/20 rounded-full blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge: Custom border and text color */}
              <span className="inline-block py-1 px-3 rounded-full bg-white border border-[#2ECC71]/30 text-[#2ECC71] text-xs font-bold tracking-wider uppercase mb-6 shadow-sm">
                ✨ The Smart Way to Rent home process
              </span>

              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Find your <span className="text-[#2ECC71]">Perfect Home</span>{" "}
                <br />
                without the stress.
              </h1>

              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                RentEase bridges the gap between tenants and landlords with a
                transparent, automated, and secure rental experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  // Replaced btn-primary with specific hex background
                  className="px-10 py-4 bg-[#2ECC71] hover:bg-[#27ae60] text-white rounded-full font-semibold text-lg shadow-lg transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/available-properties"
                  className="px-10 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:border-[#2ECC71] hover:text-[#2ECC71] transition-all"
                >
                  Browse Homes
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Floating Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-5xl mx-auto mt-20 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100"
          >
            {[
              { value: "5K+", label: "Happy Tenants" },
              { value: "1.2K+", label: "Verified Properties" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="pt-4 md:pt-0">
                <div className="text-4xl font-bold text-[#2ECC71] mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="pt-0 pb-24 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Latest Listings
              </h2>
              <p className="text-gray-500">
                Freshly added properties in top locations.
              </p>
            </div>
            <Link
              to="/available-properties"
              className="hidden md:block text-[#2ECC71] font-semibold hover:underline"
            >
              View All Properties &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Loading properties...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 6).map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PublicPropertyCard property={property} index={i} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/available-properties"
              className="w-full block py-3 rounded-lg text-center bg-[#2ECC71] text-white font-semibold"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6 bg-[#2ECC71]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How RentEase Works
            </h2>
            <p className="text-gray-600">
              A seamless workflow designed to save time for both landlords and
              tenants.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                title: "Search & Discover",
                desc: "Filter through thousands of verified listings to find a home that fits your budget and lifestyle.",
              },
              {
                step: "02",
                title: "Apply Instantly",
                desc: "Submit your rental application digitally. No paperwork, no hassle, just quick approvals.",
              },
              {
                step: "03",
                title: "Move in & Relax",
                desc: "Pay rent online, track expenses, and manage maintenance requests all from one dashboard.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Step Icon: Light background of theme color */}
                <div className="w-12 h-12 bg-[#2ECC71]/10 text-[#2ECC71] rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-[#2ECC71] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to simplify your rental journey?
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of landlords and tenants who are managing their
            rentals with RentEase today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-[#2ECC71] font-bold rounded-xl hover:bg-green-50 transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-[#27ae60] text-white font-bold rounded-xl border border-[#2ecc71] hover:bg-[#219150] transition"
            >
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
