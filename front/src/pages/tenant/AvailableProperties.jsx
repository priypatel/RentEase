// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";

// import Header from "../../components/Header";
// import Footer from "../../components/Footer";

// import { getAllProperties } from "../../redux/slices/propertySlice";
// import PropertyCard from "../../components/property/PropertyCard";
// import SkeletonCard from "../../components/common/SkeletonCard";
// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";
// import { SlidersHorizontal } from "lucide-react";

// export default function AvailableProperties() {
//   const dispatch = useDispatch();
//   const { items, loading } = useSelector((state) => state.properties);

//   const [statusFilter, setStatusFilter] = useState("all");
//   const [priceRange, setPriceRange] = useState([0, 200000]);
//   const [showFilter, setShowFilter] = useState(false);

//   useEffect(() => {
//     dispatch(getAllProperties());
//   }, [dispatch]);

//   // Filter Logic
//   const filteredProperties = items.filter((p) => {
//     let statusMatch =
//       statusFilter === "all" ? true : p.status?.toLowerCase() === statusFilter;

//     let priceMatch = p.rent >= priceRange[0] && p.rent <= priceRange[1];

//     return statusMatch && priceMatch;
//   });

//   return (
//     <>
//       {/* PUBLIC HEADER */}
//       <Header />

//       {/* MAIN CONTENT — PUBLIC LAYOUT */}

//       <section className="px-6 md:px-12 lg:px-20 py-12">
//         {/* Title + Filter Button */}
//         <div className="flex items-center justify-between mb-6">
//           <PageTitle>Available Properties</PageTitle>

//           <button
//             onClick={() => setShowFilter(true)}
//             className="
//     flex items-center gap-2
//     px-5 py-2.5 rounded-xl
//     btn-primary
//     text-sm font-semibold
//     shadow-md hover:shadow-lg
//     transition-all active:scale-95
//   "
//           >
//             <SlidersHorizontal className="w-4 h-4" />
//             Filters
//           </button>
//         </div>

//         {/* ---------------------- FILTER MODAL ---------------------- */}
//         {showFilter && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
//             <div className="relative bg-white w-96 p-6 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
//               {/* Close Button */}
//               <button
//                 onClick={() => setShowFilter(false)}
//                 className="
//                   absolute top-4 right-4
//                   w-10 h-10
//                   flex items-center justify-center
//                   rounded-full
//                   backdrop-blur-md bg-green-200/40
//                   border border-white/40
//                   shadow-md
//                   hover:bg-green-500/40 hover:scale-105
//                   active:scale-95
//                   transition-all
//                   text-green-700
//                 "
//               >
//                 ✕
//               </button>

//               <h2 className="text-2xl font-semibold text-green-700 mb-5">
//                 Filter Properties
//               </h2>

//               {/* Status Filter */}
//               <div className="mb-5">
//                 <label className="text-gray-700 font-medium">Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="mt-2 w-full p-3 rounded-xl border border-green-300 bg-green-50
//                     focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
//                 >
//                   <option value="all">All</option>
//                   <option value="available">Available</option>
//                   <option value="pending">Pending</option>
//                   <option value="rented">Rented</option>
//                 </select>
//               </div>

//               {/* Price */}
//               <div className="mb-6">
//                 <label className="text-gray-700 font-medium">
//                   Price Range (₹)
//                 </label>
//                 <div className="flex gap-3 mt-2">
//                   <input
//                     type="number"
//                     value={priceRange[0]}
//                     onChange={(e) =>
//                       setPriceRange([Number(e.target.value), priceRange[1]])
//                     }
//                     className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
//                       focus:outline-none focus:ring-2 focus:ring-green-400"
//                     placeholder="Min"
//                   />

//                   <input
//                     type="number"
//                     value={priceRange[1]}
//                     onChange={(e) =>
//                       setPriceRange([priceRange[0], Number(e.target.value)])
//                     }
//                     className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
//                       focus:outline-none focus:ring-2 focus:ring-green-400"
//                     placeholder="Max"
//                   />
//                 </div>
//               </div>

//               {/* Reset Only */}
//               <div className="flex justify-between">
//                 <button
//                   onClick={() => {
//                     setStatusFilter("all");
//                     setPriceRange([0, 200000]);
//                   }}
//                   className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700
//                     rounded-xl hover:bg-gray-200 transition-all active:scale-95"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ---------------------- PROPERTY GRID ---------------------- */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {Array.from({ length: 6 }).map((_, idx) => (
//               <SkeletonCard key={idx} />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredProperties.map((p, index) => (
//               <motion.div
//                 {...cardAnim(index)}
//                 className="fade-card"
//                 key={p._id}
//               >
//                 <PropertyCard property={p} index={index} />
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </section>

//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import {
  getAllProperties,
  searchProperties,
} from "../../redux/slices/propertySlice";

import PropertyCard from "../../components/property/PropertyCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";
import { SlidersHorizontal } from "lucide-react";

export default function AvailableProperties() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.properties);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilter, setShowFilter] = useState(false);

  // For search input
  const [searchQuery, setSearchQuery] = useState("");

  // // 👉 Load all properties on mount
  // useEffect(() => {
  //   dispatch(getAllProperties());
  // }, [dispatch]);

  // 👉 Trigger search (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim() === "") {
        dispatch(getAllProperties());
      } else {
        dispatch(searchProperties(searchQuery));
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery, dispatch]);

  // 👉 Combined filter logic
  const filteredProperties = items.filter((p) => {
    let statusMatch =
      statusFilter === "all" ? true : p.status?.toLowerCase() === statusFilter;

    let priceMatch = p.rent >= priceRange[0] && p.rent <= priceRange[1];

    return statusMatch && priceMatch;
  });

  return (
    <>
      <Header />

      <section className="px-6 md:px-12 lg:px-20 py-12">
        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <PageTitle>Available Properties</PageTitle>

          <div className="flex items-center gap-3">
            {/* 🔍 SEARCH BAR */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, city, location..."
              className="
                px-4 py-2 rounded-xl border border-green-300 bg-green-50
                focus:outline-none focus:ring-2 focus:ring-green-400
                text-gray-800 w-60
              "
            />

            {/* FILTER BUTTON */}
            <button
              onClick={() => setShowFilter(true)}
              className="
                flex items-center gap-2 px-5 py-2.5 rounded-xl
                btn-primary text-sm font-semibold shadow-md
                hover:shadow-lg active:scale-95 transition-all
              "
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* ---------------- FILTER MODAL ---------------- */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="relative bg-white w-96 p-6 rounded-2xl shadow-xl border border-gray-200">
              {/* Close Button */}
              <button
                onClick={() => setShowFilter(false)}
                className="
                  absolute top-4 right-4 w-10 h-10 flex items-center justify-center
                  rounded-full bg-green-200/40 border shadow hover:scale-105
                  active:scale-95 transition-all
                "
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-green-700 mb-5">
                Filter Properties
              </h2>

              {/* Status Filter */}
              <div className="mb-5">
                <label className="text-gray-700 font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
                    mt-2 w-full p-3 rounded-xl border border-green-300 bg-green-50
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="text-gray-700 font-medium">
                  Price Range (₹)
                </label>
                <div className="flex gap-3 mt-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="
                      w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
                      focus:outline-none focus:ring-2 focus:ring-green-400
                    "
                    placeholder="Min"
                  />

                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="
                      w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
                      focus:outline-none focus:ring-2 focus:ring-green-400
                    "
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* RESET */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriceRange([0, 200000]);
                  }}
                  className="
                    px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700
                    rounded-xl hover:bg-gray-200 active:scale-95 transition-all
                  "
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- PROPERTY GRID ---------------- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((p, index) => (
                <motion.div key={p._id} {...cardAnim(index)}>
                  <PropertyCard property={p} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-lg">No properties found.</p>
            )}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
