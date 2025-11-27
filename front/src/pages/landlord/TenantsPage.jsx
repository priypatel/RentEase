// // src/pages/landlord/TenantsPage.jsx
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";
// /**
//  * TenantsPage
//  *
//  * Landlord-facing page that lists all properties for which there are rental requests.
//  * Shows tenant details alongside property info, deposit & request status and actions:
//  *  - View Payments -> /landlord/payments/:requestId
//  *  - View Request  -> /landlord/request/:requestId   (if you prefer a different route rename accordingly)
//  *
//  * Uses: rentalRequestSlice -> getRequestsForLandlord
//  *
//  * NOTE: This file includes a small inline skeleton to avoid depending on external skeleton files.
//  * If you prefer to reuse a global skeleton component, replace <CardSkeleton /> usage with your shared skeleton.
//  */

// function CardSkeleton() {
//   return (
//     <div className="p-5 bg-white/40 rounded-3xl backdrop-blur-xl border border-gray-200 shadow animate-pulse">
//       <div className="flex gap-6">
//         <div className="w-36 h-28 bg-gray-200/60 rounded-xl" />
//         <div className="flex-1">
//           <div className="h-5 w-48 bg-gray-200/70 rounded-md mb-3" />
//           <div className="h-4 w-36 bg-gray-200/60 rounded-md mb-2" />
//           <div className="h-4 w-28 bg-gray-200/60 rounded-md mb-3" />
//           <div className="flex gap-3 mt-2">
//             <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
//             <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
//           </div>
//         </div>
//         <div className="w-28 flex items-center justify-center">
//           <div className="h-10 w-28 bg-gray-200/60 rounded-full" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function TenantsPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user } = useSelector((state) => state.auth);
//   const landlordId = user?.id;

//   const { landlordRequests = [], loading } = useSelector(
//     (state) => state.rentalRequest
//   );

//   useEffect(() => {
//     if (landlordId) dispatch(getRequestsForLandlord(landlordId));
//   }, [dispatch, landlordId]);

//   // quick helper to format deposit text
//   const depositText = (req) =>
//     req.depositStatus === "paid" ? "Deposit Paid" : "Deposit Pending";

//   return (
//     <div className="page-container max-w-6xl mx-auto">
//       <PageTitle>Tenants</PageTitle>

//       {/* Loading skeletons */}
//       {loading && (
//         <div className="grid gap-7">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.04 }}
//             >
//               <CardSkeleton />
//             </motion.div>
//           ))}
//         </div>
//       )}

//       {/* Content */}
//       {!loading && (
//         <>
//           <div className="grid gap-7">
//             {landlordRequests.map((req, i) => (
//               <motion.div
//                 key={req._id}
//                 {...cardAnim(i)}
//                 className="fade-card p-5"
//               >
//                 <div className="flex flex-col sm:flex-row gap-6">
//                   {/* Image */}
//                   <div className="w-full h-40 sm:w-36 sm:h-28 rounded-xl overflow-hidden">
//                     <img
//                       src={req.propertyId?.images?.[0]?.url}
//                       alt={req.propertyId?.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* Details */}
//                   <div className="flex-1">
//                     <h2 className="text-xl font-bold text-green-900">
//                       {req.propertyId?.title}
//                     </h2>

//                     <p className="text-gray-700">
//                       📍 {req.propertyId?.location}
//                     </p>

//                     <p className="mt-2 text-green-700 font-semibold">
//                       Rent: ₹{req.propertyId?.rent}
//                     </p>

//                     <div className="mt-3 text-sm text-gray-700">
//                       <div>
//                         <span className="font-medium text-gray-900">
//                           Tenant:
//                         </span>{" "}
//                         <span className="ml-1">
//                           {req.tenantId?.name || "-"}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-900">
//                           Email:
//                         </span>{" "}
//                         <span className="ml-1">
//                           {req.tenantId?.email || "-"}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-900">
//                           Phone:
//                         </span>{" "}
//                         <span className="ml-1">
//                           {req.tenantId?.phone || "-"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Badges */}
//                     <div className="mt-3 flex gap-3 flex-wrap">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                           req.depositStatus === "paid"
//                             ? "bg-green-50 text-green-700 border-green-300"
//                             : "bg-yellow-50 text-yellow-700 border-yellow-300"
//                         }`}
//                       >
//                         {depositText(req)}
//                       </span>

//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium border ${
//                           req.status === "approved"
//                             ? "bg-blue-50 text-blue-800 border-blue-300"
//                             : req.status === "requested"
//                             ? "bg-yellow-50 text-yellow-700 border-yellow-300"
//                             : "bg-red-50 text-red-700 border-red-300"
//                         }`}
//                       >
//                         {req.status?.toUpperCase()}
//                       </span>

//                       {/* show current rent cycle if exists */}
//                       {req.rentCycleStart && (
//                         <span className="px-3 py-1 rounded-full text-sm font-medium border bg-green-50 text-green-700 border-green-300">
//                           Since{" "}
//                           {new Date(req.rentCycleStart).toLocaleDateString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex flex-col sm:items-end sm:justify-between mt-4 sm:mt-0">
//                     <div className="space-y-2">
//                       {/* <button
//                         onClick={() =>
//                           navigate(`/landlord/payments/${req._id}`)
//                         }
//                         className="px-5 py-2 rounded-full glass-btn-blue text-sm"
//                       >
//                         View Payments
//                       </button> */}
//                     </div>

//                     <div className="text-sm text-gray-500">
//                       <div>
//                         Listed: {new Date(req.createdAt).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {landlordRequests.length === 0 && (
//             <div className="mt-10 text-center">
//               <div className="inline-block p-8 rounded-2xl bg-green-50/60 border border-green-100 shadow">
//                 <h3 className="text-lg font-semibold text-green-900">
//                   No tenants found
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-2">
//                   You don't have any approved rental requests yet.
//                 </p>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// src/pages/landlord/TenantsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";

import { Home, MapPin, IndianRupee, User } from "lucide-react";

// Inline Skeleton (kept same, but theme matched)
function CardSkeleton() {
  return (
    <div className="p-5 bg-white/50 rounded-3xl backdrop-blur-xl border border-gray-200 shadow animate-pulse">
      <div className="flex gap-6">
        <div className="w-36 h-28 bg-gray-200/60 rounded-xl" />
        <div className="flex-1">
          <div className="h-5 w-48 bg-gray-200/70 rounded-md mb-3" />
          <div className="h-4 w-36 bg-gray-200/60 rounded-md mb-2" />
          <div className="h-4 w-28 bg-gray-200/60 rounded-md mb-3" />
          <div className="flex gap-3 mt-2">
            <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
            <div className="h-6 w-28 bg-gray-200/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const landlordId = user?.id;

  const { landlordRequests = [], loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (landlordId) dispatch(getRequestsForLandlord(landlordId));
  }, [dispatch, landlordId]);

  return (
    <div className="page-container bg-app min-h-screen max-w-6xl mx-auto">
      <PageTitle>Tenants</PageTitle>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-7">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <CardSkeleton />
            </motion.div>
          ))}
        </div>
      )}

      {/* CONTENT */}
      {!loading && (
        <>
          <div className="grid gap-7">
            {landlordRequests.map((req, index) => (
              <motion.div
                key={req._id}
                {...cardAnim(index)}
                className="
                  bg-white/80 backdrop-blur-xl
                  p-5 rounded-2xl
                  border border-gray-200
                  shadow-md hover:shadow-lg transition
                "
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* IMAGE */}
                  <div className="w-full sm:w-36 h-40 sm:h-32 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={req.propertyId?.images?.[0]?.url}
                      alt={req.propertyId?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1">
                    {/* TITLE */}
                    <h2 className="text-xl font-semibold text-primaryDark flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      {req.propertyId?.title}
                    </h2>

                    {/* LOCATION */}
                    <p className="text-grayText flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {req.propertyId?.location}
                    </p>

                    {/* RENT */}
                    <p className="mt-2 text-primary font-bold flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {req.propertyId?.rent}/month
                    </p>

                    {/* TENANT INFO */}
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <p className="flex items-center gap-1">
                        <User className="w-4 h-4 text-primary" />
                        <b className="text-gray-900">Tenant:</b>{" "}
                        {req.tenantId?.name}
                      </p>
                      <p>
                        <b className="text-gray-900">Email:</b>{" "}
                        {req.tenantId?.email}
                      </p>
                      <p>
                        <b className="text-gray-900">Phone:</b>{" "}
                        {req.tenantId?.phone}
                      </p>
                    </div>

                    {/* BADGES */}
                    <div className="mt-3 flex gap-3 flex-wrap">
                      {/* Deposit */}
                      <span
                        className={`badge ${
                          req.depositStatus === "paid"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {req.depositStatus === "paid"
                          ? "Deposit Paid"
                          : "Deposit Pending"}
                      </span>

                      {/* Approval */}
                      <span
                        className={`badge ${
                          req.status === "approved"
                            ? "badge-success"
                            : req.status === "requested"
                            ? "badge-warning"
                            : "badge-danger"
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>

                      {req.rentCycleStart && (
                        <span className="badge badge-success">
                          Since{" "}
                          {new Date(req.rentCycleStart).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
                    <p className="text-xs text-gray-500">
                      Listed: {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {landlordRequests.length === 0 && (
            <div className="mt-10 text-center">
              <div className="inline-block p-8 rounded-2xl bg-white/70 border border-gray-200 shadow">
                <h3 className="text-lg font-semibold text-primaryDark">
                  No tenants found
                </h3>
                <p className="text-sm text-grayText mt-2">
                  You don't have any approved rental requests yet.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
