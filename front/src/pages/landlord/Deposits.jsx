// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
// import { motion } from "framer-motion";
// import { cardAnim } from "../../components/common/cardAnim";
// import PageTitle from "../../components/common/PageTitle";

// export default function Deposits() {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);

//   const { landlordRequests, loading } = useSelector(
//     (state) => state.rentalRequest
//   );

//   // Fetch landlord-approved requests
//   useEffect(() => {
//     if (!user) return;

//     const landlordId = user._id || user.id;
//     dispatch(getRequestsForLandlord(landlordId));
//   }, [dispatch, user]);

//   // Filter only "approved" requests
//   const approvedRequests = landlordRequests?.filter(
//     (r) => r.status === "approved"
//   );

//   return (
//     <div className="py-0 px-0 sm:py-10 sm:px-6">
//       {/* PAGE TITLE */}
//       <PageTitle>Deposit Requests</PageTitle>

//       {/* LOADING */}
//       {loading && <p className="text-gray-600">Loading deposits...</p>}

//       {/* EMPTY */}
//       {!loading && approvedRequests?.length === 0 && (
//         <p className="text-gray-600 mt-3">No approved requests yet.</p>
//       )}

//       {/* LIST */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {approvedRequests?.map((req, index) => (
//           <motion.div
//             key={req._id}
//             {...cardAnim(index)}
//             className="fade-card p-5"
//           >
//             {/* PROPERTY */}
//             <div className="flex gap-4">
//               <img
//                 src={req.propertyId.images?.[0]?.url}
//                 alt="property"
//                 className="w-28 h-24 rounded-xl object-cover"
//               />

//               <div>
//                 <h2 className="text-lg font-semibold text-green-900">
//                   {req.propertyId.title}
//                 </h2>
//                 <p className="text-gray-700">{req.propertyId.location}</p>
//                 <p className="text-green-700 font-bold mt-1">
//                   ₹{req.propertyId.rent}/month
//                 </p>
//               </div>
//             </div>

//             {/* TENANT DETAILS */}
//             <div className="mt-4 text-gray-800 text-sm">
//               <p>
//                 <strong>Tenant:</strong> {req.tenantId.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {req.tenantId.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {req.tenantId.phone}
//               </p>
//             </div>

//             {/* DEPOSIT AMOUNT */}
//             <div className="mt-4 text-green-900 font-medium">
//               Deposit Amount:{" "}
//               <span className="font-bold">₹{req.depositAmount}</span>
//             </div>

//             {/* DEPOSIT STATUS BADGE */}
//             <div className="mt-5">
//               <span
//                 className={`inline-flex px-4 py-1 font-medium text-xs rounded-full border
//                   ${
//                     req.depositStatus === "paid"
//                       ? "bg-green-50 text-green-700 border-green-300"
//                       : "bg-yellow-50 text-yellow-700 border-yellow-300"
//                   }`}
//               >
//                 {req.depositStatus === "paid"
//                   ? "DEPOSIT PAID"
//                   : "DEPOSIT PENDING"}
//               </span>
//             </div>

//             {/* ACTION BUTTON */}
//             {/* <button className="w-full mt-5 py-2 rounded-full glass-btn-blue text-sm font-medium">
//               View Details
//             </button> */}
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsForLandlord } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";
import { cardAnim } from "../../components/common/cardAnim";
import PageTitle from "../../components/common/PageTitle";

import { Home, MapPin, IndianRupee } from "lucide-react";

export default function Deposits() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { landlordRequests, loading } = useSelector(
    (state) => state.rentalRequest
  );

  // Fetch landlord-approved requests
  useEffect(() => {
    if (!user) return;

    const landlordId = user._id || user.id;
    dispatch(getRequestsForLandlord(landlordId));
  }, [dispatch, user]);

  // Filter only "approved" requests
  const approvedRequests = landlordRequests?.filter(
    (r) => r.status === "approved"
  );

  return (
    <div className="py-0 px-0 sm:py-10 sm:px-6 bg-app min-h-screen">
      {/* PAGE TITLE */}
      <PageTitle>Deposit Requests</PageTitle>

      {/* LOADING */}
      {loading && <p className="text-grayText">Loading deposits...</p>}

      {/* EMPTY */}
      {!loading && approvedRequests?.length === 0 && (
        <p className="text-grayText mt-3">No approved requests yet.</p>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvedRequests?.map((req, index) => (
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
            {/* PROPERTY */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden shadow-md">
                <img
                  src={req.propertyId.images?.[0]?.url}
                  alt="property"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                {/* TITLE */}
                <h2 className="text-xl font-semibold text-primaryDark flex items-center gap-2">
                  <Home className="w-6 h-6 text-primary" />
                  {req.propertyId.title}
                </h2>

                {/* LOCATION */}
                <p className="text-grayText flex items-center gap-2 mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                  {req.propertyId.location}
                </p>

                {/* RENT */}
                <p className="mt-2 text-primary font-bold text-lg flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {req.propertyId.rent}/month
                </p>
              </div>
            </div>

            {/* TENANT DETAILS */}
            <div className="mt-4 text-gray-800 text-sm">
              <p>
                <strong>Tenant:</strong> {req.tenantId.name}
              </p>
              <p>
                <strong>Email:</strong> {req.tenantId.email}
              </p>
              <p>
                <strong>Phone:</strong> {req.tenantId.phone}
              </p>
            </div>

            {/* DEPOSIT AMOUNT */}
            <div className="mt-4 text-primaryDark font-medium flex items-center gap-1">
              Deposit Amount:
              <span className="font-bold">₹{req.depositAmount}</span>
            </div>

            {/* DEPOSIT STATUS BADGE */}
            <div className="mt-5">
              {req.depositStatus === "paid" ? (
                <span className="badge-success">DEPOSIT PAID</span>
              ) : (
                <span className="badge-warning">DEPOSIT PENDING</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
