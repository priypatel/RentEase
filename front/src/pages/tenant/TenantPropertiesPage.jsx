// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTenantRequests } from "../../redux/slices/rentalRequestSlice";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// import Header from "../../components/Header";
// import Footer from "../../components/Footer";

// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";

// import { MapPin, IndianRupee, Home } from "lucide-react";

// export default function TenantPropertiesPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { tenantRequests, loading } = useSelector(
//     (state) => state.rentalRequest
//   );

//   useEffect(() => {
//     dispatch(fetchTenantRequests());
//   }, []);

//   if (loading || !tenantRequests)
//     return (
//       <>
//         <Header />
//         <p className="p-6 text-grayText">Loading...</p>
//         <Footer />
//       </>
//     );

//   return (
//     <>
//       <Header />

//       <section className="px-6 md:px-12 lg:px-20 py-12 min-h-screen bg-app">
//         <PageTitle>My Rental Properties</PageTitle>

//         <div className="grid gap-7">
//           {tenantRequests.map((req, i) => (
//             <motion.div
//               key={req._id}
//               {...cardAnim(i)}
//               className="
//                 bg-white/80 backdrop-blur-xl
//                 p-5 relative rounded-2xl
//                 border border-gray-200
//                 shadow-md hover:shadow-lg transition
//               "
//             >
//               <div className="flex flex-col md:flex-row gap-6">
//                 {/* IMAGE */}
//                 <div className="w-full md:w-40 h-32 overflow-hidden rounded-2xl shadow-md">
//                   <img
//                     src={req.propertyId?.images?.[0]?.url}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//                   />
//                 </div>

//                 {/* DETAILS */}
//                 <div className="flex-1">
//                   <h2 className="text-xl font-semibold text-primaryDark flex item-center gap-1">
//                     <Home className="w-7 h-7" />
//                     {req.propertyId?.title}
//                   </h2>

//                   <p className="text-grayText mt-1 flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-primary" />
//                     {req.propertyId?.location}
//                   </p>

//                   <p className="mt-2 text-primary font-bold text-lg flex items-center gap-1">
//                     <IndianRupee className="w-5 h-5" />
//                     {req.propertyId?.rent}/month
//                   </p>

//                   {/* STATUS BADGES */}
//                   <div className="mt-3 flex items-center flex-wrap gap-2">
//                     {/* RENTAL REQUEST STATUS */}
//                     {req.status === "requested" && (
//                       <span className="badge-warning">REQUESTED</span>
//                     )}

//                     {req.status === "approved" && (
//                       <span className="badge-info">APPROVED</span>
//                     )}

//                     {req.status === "rejected" && (
//                       <span className="badge-danger">REJECTED</span>
//                     )}

//                     {req.status === "rented" && (
//                       <span className="badge-success">RENTED</span>
//                     )}

//                     {/* DEPOSIT STATUS */}
//                     {req.status === "approved" && (
//                       <>
//                         {req.depositStatus === "paid" ? (
//                           <span className="badge-success">Deposit Paid</span>
//                         ) : (
//                           <span className="badge-warning">Deposit Pending</span>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* VIEW BUTTON */}
//                 <div className="flex items-center justify-center md:justify-end">
//                   <button
//                     onClick={() => navigate(`/tenant/rental-status/${req._id}`)}
//                     className="w-full mt-4 px-5 py-2.5 rounded-xl text-sm btn-primary flex items-center justify-center gap-2"
//                   >
//                     View Status
//                   </button>
//                 </div>
//               </div>

//               {/* Glow overlay */}
//               <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-white/10 to-transparent"></div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       <Footer />
//     </>
//   );
// }
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenantRequests } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";

import { Home, MapPin, IndianRupee } from "lucide-react";

export default function TenantPropertiesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tenantRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    dispatch(fetchTenantRequests());
  }, []);

  if (loading || !tenantRequests)
    return (
      <>
        <Header />
        <p className="p-6 text-grayText">Loading...</p>
        <Footer />
      </>
    );

  return (
    <>
      <Header />

      <section className="px-6 md:px-12 lg:px-20 py-12 min-h-screen bg-app">
        <PageTitle>My Rental Properties</PageTitle>

        <div className="grid gap-7">
          {tenantRequests.map((req, i) => (
            <motion.div
              key={req._id}
              {...cardAnim(i)}
              className="
                bg-white/80 backdrop-blur-xl
                p-5 relative rounded-2xl
                border border-gray-200
                shadow-md hover:shadow-lg transition
              "
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* IMAGE */}
                <div className="w-full md:w-40 h-32 overflow-hidden rounded-2xl shadow-md">
                  <img
                    src={req.propertyId?.images?.[0]?.url}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-primaryDark flex items-center gap-2">
                    <Home className="w-6 h-6 text-primary" />
                    {req.propertyId?.title}
                  </h2>

                  <p className="text-grayText mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {req.propertyId?.location}
                  </p>

                  <p className="mt-2 text-primary font-bold text-lg flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {req.propertyId?.rent}/month
                  </p>

                  {/* STATUS BADGES */}
                  <div className="mt-3 flex items-center flex-wrap gap-2">
                    {req.status === "requested" && (
                      <span className="badge-warning">REQUESTED</span>
                    )}
                    {req.status === "approved" && (
                      <span className="badge-success">APPROVED</span>
                    )}
                    {req.status === "rejected" && (
                      <span className="badge-danger">REJECTED</span>
                    )}
                    {req.status === "rented" && (
                      <span className="badge-success">RENTED</span>
                    )}

                    {req.status === "approved" &&
                      (req.depositStatus === "paid" ? (
                        <span className="badge-success">Deposit Paid</span>
                      ) : (
                        <span className="badge-warning">Deposit Pending</span>
                      ))}
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex items-center justify-center md:justify-end">
                  <button
                    onClick={() => navigate(`/tenant/rental-status/${req._id}`)}
                    className="w-full mt-4 px-5 py-2.5 rounded-xl text-sm btn-primary flex items-center justify-center"
                  >
                    View Status
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
