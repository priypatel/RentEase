// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import PaymentSkeletonCard from "../../components/common/PaymentSkeletonCard";
// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";

// export default function LandlordPropertiesForPayment() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.auth);
//   const landlordId = user?.id;

//   const { landlordRequests = [], loading } = useSelector(
//     (state) => state.rentalRequest
//   );

//   useEffect(() => {
//     if (landlordId) dispatch(getRequestsForLandlord(landlordId));
//   }, [landlordId]);

//   // SHOW SKELETON IF LOADING OR DATA NOT YET LOADED
//   if (loading || !landlordRequests) {
//     return (
//       <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <PaymentSkeletonCard key={i} />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="page-container max-w-6xl mx-auto">
//       <PageTitle>Properties Rent Status</PageTitle>

//       <div className="grid gap-7">
//         {landlordRequests.map((req, i) => (
//           <motion.div key={req._id} {...cardAnim(i)} className="fade-card">
//             <div className="flex flex-col sm:flex-row gap-6 p-5">
//               {/* Image */}
//               <div className="w-full h-40 sm:w-40 sm:h-32 rounded-xl overflow-hidden">
//                 <img
//                   src={req.propertyId?.images?.[0]?.url}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Middle content */}
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold text-gray-900">
//                   {req.propertyId?.title}
//                 </h2>

//                 <p className="text-gray-600 mt-1">
//                   📍 {req.propertyId?.location}
//                 </p>

//                 <p className="text-green-700 font-bold mt-2 text-lg">
//                   ₹{req.propertyId?.rent}/month
//                 </p>

//                 <p className="text-sm text-gray-700 mt-2">
//                   Tenant:{" "}
//                   <span className="font-bold text-green-900">
//                     {req.tenantId?.name}
//                   </span>
//                 </p>

//                 {/* Badges */}
//                 <div className="flex gap-3 mt-3">
//                   {/* Deposit Status */}
//                   <span
//                     className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border
//                       ${
//                         req.depositStatus === "paid"
//                           ? "bg-green-50 text-green-700 border-green-300"
//                           : "bg-yellow-50 text-yellow-700 border-yellow-300"
//                       }
//                     `}
//                   >
//                     Deposit: {req.depositStatus.toUpperCase()}
//                   </span>

//                   {/* Approval Status */}
//                   <span
//                     className={`px-4 py-1 flex items-center gap-1.5 font-medium text-xs rounded-full border
//                       ${
//                         req.status === "approved"
//                           ? "bg-green-50 text-green-700 border-green-300"
//                           : req.status === "requested"
//                           ? "bg-yellow-50 text-yellow-700 border-yellow-300"
//                           : "bg-red-50 text-red-700 border-red-300"
//                       }
//                     `}
//                   >
//                     {req.status.toUpperCase()}
//                   </span>
//                 </div>
//               </div>

//               {/* Right Button */}
//               <div className="flex sm:items-center mt-4 sm:mt-0">
//                 <button
//                   onClick={() => navigate(`/landlord/payments/${req._id}`)}
//                   className="
//                     w-full sm:w-auto
//                     px-5 py-2.5 text-sm font-medium rounded-full
//                     glass-btn-blue shadow-md hover:shadow-lg transition
//                   "
//                 >
//                   View Payments
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       {landlordRequests.length === 0 && (
//         <p className="text-center text-gray-600 mt-10">
//           No rented properties yet.
//         </p>
//       )}
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PaymentSkeletonCard from "../../components/common/PaymentSkeletonCard";
import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";

import { Home, MapPin, IndianRupee } from "lucide-react";

export default function LandlordPropertiesForPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const landlordId = user?.id || user?._id;

  const { landlordRequests = [], loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (landlordId) dispatch(getRequestsForLandlord(landlordId));
  }, [landlordId]);

  // --- LOADING STATE ---
  if (loading || !landlordRequests) {
    return (
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <PaymentSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="page-container bg-app min-h-screen max-w-6xl mx-auto">
      <PageTitle>Properties Rent Status</PageTitle>

      <div className="grid gap-7">
        {landlordRequests.map((req, i) => (
          <motion.div
            key={req._id}
            {...cardAnim(i)}
            className="
              bg-white/80 backdrop-blur-xl
              p-5 rounded-2xl
              border border-gray-200
              shadow-md hover:shadow-lg transition
            "
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* IMAGE */}
              <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shadow-md">
                <img
                  src={req.propertyId?.images?.[0]?.url}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1">
                {/* TITLE */}
                <h2 className="text-xl font-semibold text-primaryDark flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  {req.propertyId?.title}
                </h2>

                {/* LOCATION */}
                <p className="text-grayText mt-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {req.propertyId?.location}
                </p>

                {/* RENT */}
                <p className="mt-2 text-primary font-bold text-lg flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {req.propertyId?.rent}/month
                </p>

                {/* TENANT */}
                <p className="text-sm text-gray-700 mt-3">
                  Tenant:{" "}
                  <span className="font-bold text-primaryDark">
                    {req.tenantId?.name}
                  </span>
                </p>

                {/* BADGES */}
                <div className="flex flex-wrap gap-3 mt-3">
                  {/* Deposit Status */}
                  <span
                    className={`badge ${
                      req.depositStatus === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    Deposit: {req.depositStatus.toUpperCase()}
                  </span>

                  {/* Approval Status */}
                  {req.status === "approved" && (
                    <span className="badge-success">APPROVED</span>
                  )}
                  {req.status === "requested" && (
                    <span className="badge-warning">REQUESTED</span>
                  )}
                  {req.status === "rejected" && (
                    <span className="badge-danger">REJECTED</span>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex sm:items-center justify-start sm:justify-end mt-4 sm:mt-0">
                <button
                  onClick={() => navigate(`/landlord/payments/${req._id}`)}
                  className="
                    px-5 py-2.5 rounded-xl text-sm font-medium
                    btn-primary shadow-sm
                  "
                >
                  View Payments
                </button>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-white/10 to-transparent" />
          </motion.div>
        ))}
      </div>

      {landlordRequests.length === 0 && (
        <p className="text-center text-grayText mt-10">
          No rented properties yet.
        </p>
      )}
    </div>
  );
}
