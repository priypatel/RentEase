// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";

// import { getAllProperties } from "../../redux/slices/propertySlice";
// import PropertyCard from "../../components/property/PropertyCard";
// import SkeletonCard from "../../components/common/SkeletonCard";
// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";

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
//     <div className="min-h-screen page-container">
//       {/* <motion.div
//         initial={{ opacity: 0, y: -8 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="max-w-6xl mx-auto"
//       > */}
//       {/* Page Title */}
//       <div className="flex items-center justify-between mb-6">
//         <PageTitle>Available Properties</PageTitle>

//         {/* Filter Button */}
//         <button
//           onClick={() => setShowFilter(true)}
//           className="flex items-center gap-2
//                 px-5 py-2.5 rounded-xl
//                 glass-btn-green
//                 text-green-900 font-medium
//                 shadow-md hover:shadow-lg
//                 transition-all active:scale-95
//               "
//         >
//           <span className="font-medium">Filters</span>
//         </button>
//       </div>

//       {/* ---------------------- FILTER MODAL ---------------------- */}
//       {showFilter && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
//           <div className="relative bg-white w-96 p-6 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
//             {/* Close / Cancel Button */}
//             <button
//               onClick={() => setShowFilter(false)}
//               className="
//                     absolute top-4 right-4
//                     w-10 h-10
//                     flex items-center justify-center
//                     rounded-full
//                     backdrop-blur-md bg-green-200/40
//                     border border-white/40
//                     shadow-md
//                     hover:bg-green-500/40 hover:scale-105
//                     active:scale-95
//                     transition-all
//                     text-green-700
//                 "
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Header */}
//             <h2 className="text-2xl font-semibold text-green-700 mb-5">
//               Filter Properties
//             </h2>

//             {/* Status Filter */}
//             <div className="mb-5">
//               <label className="text-gray-700 font-medium">Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="mt-2 w-full p-3 rounded-xl border border-green-300 bg-green-50
//              focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
//               >
//                 <option value="all">All</option>
//                 <option value="available">Available</option>
//                 <option value="pending">Pending</option>
//                 <option value="rented">Rented</option>
//               </select>
//             </div>

//             {/* Price */}
//             <div className="mb-6">
//               <label className="text-gray-700 font-medium">
//                 Price Range (₹)
//               </label>
//               <div className="flex gap-3 mt-2">
//                 <input
//                   type="number"
//                   value={priceRange[0]}
//                   onChange={(e) =>
//                     setPriceRange([Number(e.target.value), priceRange[1]])
//                   }
//                   className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
//                focus:outline-none focus:ring-2 focus:ring-green-400"
//                   placeholder="Min"
//                 />

//                 <input
//                   type="number"
//                   value={priceRange[1]}
//                   onChange={(e) =>
//                     setPriceRange([priceRange[0], Number(e.target.value)])
//                   }
//                   className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50
//                focus:outline-none focus:ring-2 focus:ring-green-400"
//                   placeholder="Max"
//                 />
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-between">
//               <button
//                 onClick={() => {
//                   setStatusFilter("all");
//                   setPriceRange([0, 200000]);
//                 }}
//                 className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700
//              rounded-xl hover:bg-gray-200 transition-all active:scale-95"
//               >
//                 Reset
//               </button>

//               {/* Apply Button */}
//               {/* <button
//                   onClick={() => setShowFilter(false)}
//                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl
//                      bg-green-600 text-white font-medium shadow-md
//                      hover:bg-green-700 transition-all active:scale-95"
//                 >
//                   Apply
//                 </button> */}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ---------------------- PROPERTY GRID ---------------------- */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
//           {Array.from({ length: 6 }).map((_, idx) => (
//             <SkeletonCard key={idx} />
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
//           {filteredProperties.map((p, index) => (
//             <motion.div {...cardAnim(index)} className="fade-card">
//               <PropertyCard key={p._id} property={p} index={index} />
//             </motion.div>
//           ))}
//         </div>
//       )}
//       {/* </motion.div> */}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { getAllProperties } from "../../redux/slices/propertySlice";
import PropertyCard from "../../components/property/PropertyCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";

export default function AvailableProperties() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.properties);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  // Filter Logic
  const filteredProperties = items.filter((p) => {
    let statusMatch =
      statusFilter === "all" ? true : p.status?.toLowerCase() === statusFilter;

    let priceMatch = p.rent >= priceRange[0] && p.rent <= priceRange[1];

    return statusMatch && priceMatch;
  });

  return (
    <>
      {/* PUBLIC HEADER */}
      <Header />

      {/* MAIN CONTENT — PUBLIC LAYOUT */}
      <section className="px-6 md:px-12 lg:px-20 py-12 bg-[#F7FFF9] min-h-screen">
        {/* Title + Filter Button */}
        <div className="flex items-center justify-between mb-6">
          <PageTitle>Available Properties</PageTitle>

          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 
              px-5 py-2.5 rounded-xl 
              glass-btn-green
              text-green-900 font-medium
              shadow-md hover:shadow-lg 
              transition-all active:scale-95
            "
          >
            Filters
          </button>
        </div>

        {/* ---------------------- FILTER MODAL ---------------------- */}
        {showFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="relative bg-white w-96 p-6 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
              {/* Close Button */}
              <button
                onClick={() => setShowFilter(false)}
                className="
                  absolute top-4 right-4
                  w-10 h-10
                  flex items-center justify-center
                  rounded-full
                  backdrop-blur-md bg-green-200/40
                  border border-white/40
                  shadow-md
                  hover:bg-green-500/40 hover:scale-105
                  active:scale-95
                  transition-all
                  text-green-700
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
                  className="mt-2 w-full p-3 rounded-xl border border-green-300 bg-green-50 
                    focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="rented">Rented</option>
                </select>
              </div>

              {/* Price */}
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
                    className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50 
                      focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Min"
                  />

                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-1/2 p-3 rounded-xl border border-green-300 bg-green-50 
                      focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Reset Only */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setPriceRange([0, 200000]);
                  }}
                  className="px-5 py-2 bg-gray-100 border border-gray-300 text-gray-700 
                    rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------- PROPERTY GRID ---------------------- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((p, index) => (
              <motion.div
                {...cardAnim(index)}
                className="fade-card"
                key={p._id}
              >
                <PropertyCard property={p} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
