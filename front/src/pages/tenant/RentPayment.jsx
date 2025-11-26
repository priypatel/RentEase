// import React, { useEffect, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRentPayments, payRent } from "../../redux/slices/rentSlice";

// export default function RentPayment() {
//   const { requestId } = useParams();
//   const dispatch = useDispatch();

//   const rentState =
//     useSelector((state) => state.rent.byRequest[requestId]) || {};

//   const { loading, error, records = [] } = rentState;

//   const currentRent = useMemo(() => {
//     return (
//       records.find((r) => r.status === "pending") || records[records.length - 1]
//     );
//   }, [records]);

//   useEffect(() => {
//     dispatch(fetchRentPayments(requestId));
//   }, [dispatch, requestId]);

//   const handlePay = async () => {
//     if (!currentRent) return;

//     try {
//       await dispatch(
//         payRent({
//           rentId: currentRent._id,
//           amountPaid: currentRent.amount,
//         })
//       ).unwrap();

//       alert("Rent paid successfully!");
//       dispatch(fetchRentPayments(requestId));
//     } catch (err) {
//       alert(err.message || "Payment failed");
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (error) return <div className="p-6 text-red-500">{error}</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h2 className="text-3xl font-bold text-green-800 mb-4">
//         Monthly Rent Payment
//       </h2>

//       {currentRent && (
//         <div className="bg-white/40 backdrop-blur-lg rounded-2xl shadow p-5 border">
//           <h3 className="text-xl font-semibold text-green-900">
//             {currentRent.propertyId?.title}
//           </h3>
//           <p className="text-green-700">{currentRent.propertyId?.location}</p>

//           <p className="mt-4 text-lg text-green-900">
//             Rent Month: <b>{currentRent.month}</b>
//           </p>
//           <p className="text-lg text-green-900">
//             Amount: <b>₹{currentRent.amount}</b>
//           </p>

//           {currentRent.status === "pending" ? (
//             <button
//               className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow transition"
//               onClick={handlePay}
//             >
//               Pay ₹{currentRent.amount}
//             </button>
//           ) : (
//             <p className="mt-4 text-green-900 font-semibold">
//               This month’s rent is already paid ✔
//             </p>
//           )}
//         </div>
//       )}

//       <h3 className="text-2xl font-bold text-green-900 mt-8 mb-3">
//         Rent History
//       </h3>

//       <div className="space-y-4">
//         {records.map((rent) => (
//           <div
//             key={rent._id}
//             className="bg-white/40 backdrop-blur-md border rounded-xl p-4 shadow"
//           >
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-lg font-semibold text-green-900">
//                   {rent.month}
//                 </p>
//                 <p className="text-green-700">₹{rent.amount}</p>
//               </div>

//               <div className="text-right">
//                 <span
//                   className={`px-3 py-1 rounded-lg font-semibold ${
//                     rent.status === "paid"
//                       ? "bg-green-300/70 text-green-900"
//                       : "bg-yellow-300/70 text-yellow-900"
//                   }`}
//                 >
//                   {rent.status.toUpperCase()}
//                 </span>

//                 {rent.paidAt && (
//                   <p className="text-xs text-green-800 mt-1">
//                     {new Date(rent.paidAt).toLocaleDateString()}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
