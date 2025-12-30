// import React, { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRentPayments } from "../../redux/slices/rentSlice";

// import {
//   createRentOrder,
//   verifyRentPayment,
// } from "../../services/paymentService";

// import Header from "../../components/common/Header";
// import Footer from "../../components/common/Footer";

// import PaymentSuccessModal from "../../components/modals/PaymentSuccessModal";
// import PaymentHistorySkeleton from "../../components/common/PaymentHistorySkeleton";

// import PageTitle from "../../components/common/PageTitle";
// import { motion } from "framer-motion";
// import { IndianRupee, Calendar } from "lucide-react";

// export default function PaymentHistory() {
//   const { id: requestId } = useParams();
//   const dispatch = useDispatch();

//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successData, setSuccessData] = useState(null);

//   const rentState =
//     useSelector((state) => state.rent.byRequest?.[requestId]) || {};

//   const { loading, records = [] } = rentState;

//   const currentRent = useMemo(
//     () => records.find((r) => r.status === "pending"),
//     [records]
//   );

//   // FETCH PAYMENT HISTORY
//   useEffect(() => {
//     dispatch(fetchRentPayments(requestId));
//   }, [dispatch, requestId]);

//   // ---------------------------
//   // HANDLE PAYMENT
//   // ---------------------------
//   const handlePay = async () => {
//     try {
//       if (!currentRent) return alert("No pending rent found");

//       const orderResp = await createRentOrder({
//         rentId: currentRent._id,
//         amount: currentRent.amount,
//         tenantId: currentRent.tenantId?._id ?? currentRent.tenantId,
//         landlordId: currentRent.landlordId?._id ?? currentRent.landlordId,
//         propertyId: currentRent.propertyId?._id ?? currentRent.propertyId,
//         rentalRequestId: requestId,
//       });

//       const data = orderResp.data;
//       if (!data.success) return alert("Order creation failed");

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: currentRent.amount * 100,
//         currency: "INR",
//         name: "RentEase",
//         description: `Rent payment for ${currentRent.month}`,
//         order_id: data.orderId,

//         handler: async function (response) {
//           const verifyRes = await verifyRentPayment({
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//           });

//           if (!verifyRes.data.success)
//             return alert("Payment verification failed");

//           const { paidRent, nextRent } = verifyRes.data;

//           setSuccessData({
//             amount: paidRent.amount,
//             month: paidRent.month,
//             nextMonth: nextRent.month,
//           });

//           setShowSuccess(true);
//           dispatch(fetchRentPayments(requestId));
//         },
//       };

//       new window.Razorpay(options).open();
//     } catch (err) {
//       alert("Payment failed");
//     }
//   };

//   // ---------------------------
//   // LOADING SKELETON
//   // ---------------------------
//   if (loading) {
//     return (
//       <>
//         <Header />
//         <section className="px-6 md:px-12 lg:px-20 py-12 min-h-screen bg-app">
//           <PaymentHistorySkeleton />
//         </section>
//         <Footer />
//       </>
//     );
//   }

//   // SUMMARY VALUES
//   const totalPaid = records.filter((r) => r.status === "paid").length;
//   const totalAmountPaid = records
//     .filter((r) => r.status === "paid")
//     .reduce((sum, r) => sum + r.amount, 0);
//   const nextDue = records.find((r) => r.status === "pending");

//   return (
//     <>
//       <Header />

//       <section className="px-6 md:px-12 lg:px-20 py-12 min-h-screen bg-app">
//         <PageTitle>Rent Payment History</PageTitle>

//         {/* SUMMARY CARD */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="
//             mb-8 p-6 rounded-3xl
//             bg-white/80 backdrop-blur-xl
//             shadow-md border border-gray-200
//           "
//         >
//           <h3 className="text-2xl font-bold text-primaryDark mb-4">
//             Rent Summary
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Total Paid */}
//             <div className="p-4 rounded-xl bg-primaryLight border border-primary/30 shadow">
//               <p className="text-sm text-primary">Total Months Paid</p>
//               <p className="text-2xl font-bold text-primaryDark">{totalPaid}</p>
//             </div>

//             {/* Total Amount */}
//             <div className="p-4 rounded-xl bg-info/10 border border-info/30 shadow">
//               <p className="text-sm text-info">Total Amount Paid</p>
//               <p className="text-2xl font-bold text-info">₹{totalAmountPaid}</p>
//             </div>

//             {/* Next Due */}
//             <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 shadow">
//               <p className="text-sm text-yellow-700">Next Due Month</p>
//               <p className="text-xl font-semibold text-yellow-900">
//                 {nextDue ? nextDue.month : "No Pending Rent"}
//               </p>

//               {nextDue && (
//                 <p className="text-sm text-yellow-900 mt-1">
//                   Amount: <b>₹{nextDue.amount}</b>
//                 </p>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* RENT RECORDS */}
//         <div className="space-y-5">
//           {records.map((rent, index) => (
//             <motion.div
//               key={rent._id}
//               initial={{ opacity: 0, y: 15 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.08 }}
//               className="
//                 p-5 rounded-2xl
//                 bg-white/80 backdrop-blur-xl
//                 shadow-md border border-gray-200
//               "
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-xl font-semibold text-primaryDark flex items-center gap-2">
//                     <Calendar className="w-5 h-5 text-primary" />
//                     {rent.month}
//                   </p>

//                   <p className="text-primary font-bold text-lg flex items-center gap-1">
//                     <IndianRupee className="w-5 h-5" />
//                     {rent.amount}
//                   </p>

//                   {rent.paidAt && (
//                     <p className="text-xs text-grayText mt-1">
//                       Paid on {new Date(rent.paidAt).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-4">
//                   {/* STATUS BADGE */}
//                   {rent.status === "paid" ? (
//                     <span className="badge-success">PAID</span>
//                   ) : (
//                     <span className="badge-warning">PENDING</span>
//                   )}

//                   {/* PAY BUTTON */}
//                   {rent.status === "pending" && (
//                     <button
//                       onClick={handlePay}
//                       className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-95"
//                     >
//                       Pay ₹{rent.amount}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* SUCCESS MODAL */}
//         <PaymentSuccessModal
//           show={showSuccess}
//           onClose={() => setShowSuccess(false)}
//           amount={successData?.amount}
//           month={successData?.month}
//           nextMonth={successData?.nextMonth}
//           onPrint={() => window.print()}
//         />
//       </section>

//       <Footer />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentPayments } from "../../redux/slices/rentSlice";

import {
  createRentOrder,
  verifyRentPayment,
} from "../../services/paymentService";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import PaymentSuccessModal from "../../components/modals/PaymentSuccessModal";
import PaymentHistorySkeleton from "../../components/common/PaymentHistorySkeleton";
import PageTitle from "../../components/common/PageTitle";

import { motion } from "framer-motion";
import { IndianRupee, Calendar } from "lucide-react";

export default function PaymentHistory() {
  const handlePrintSlip = (rent) => {
    const slipWindow = window.open("", "_blank");

    slipWindow.document.write(`
    <html>
      <head>
        <title>Rent Payment Receipt</title>
        <style>
          body {
            font-family: Inter, Arial, sans-serif;
            background: #f4f7fb;
            padding: 40px;
          }

          .receipt {
            max-width: 520px;
            margin: auto;
            background: #ffffff;
            border-radius: 14px;
            padding: 28px;
            box-shadow: 0 12px 30px rgba(0,0,0,0.08);
          }

          h1 {
            margin: 0 0 20px;
            font-size: 24px;
            color: #0f172a;
            text-align: center;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 15px;
          }

          .label {
            color: #64748b;
            font-weight: 500;
          }

          .value {
            color: #0f172a;
            font-weight: 600;
          }

          .status {
            display: inline-block;
            margin-top: 12px;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 700;
            background: #dcfce7;
            color: #166534;
          }

          .actions {
            margin-top: 30px;
            display: flex;
            justify-content: center;
            gap: 14px;
          }

          .btn {
            padding: 10px 18px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 10px;
            border: none;
            cursor: pointer;
          }

          .btn-print {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
          }

          .btn-print:hover {
            opacity: 0.9;
          }

          .btn-close {
            background: #e5e7eb;
            color: #111827;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }

            .actions {
              display: none;
            }

            .receipt {
              box-shadow: none;
              border-radius: 0;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <h1>Rent Payment Receipt</h1>

          <div class="row">
            <span class="label">Month</span>
            <span class="value">${rent.month}</span>
          </div>

          <div class="row">
            <span class="label">Amount</span>
            <span class="value">₹${rent.amount}</span>
          </div>

          <div class="row">
            <span class="label">Paid On</span>
            <span class="value">${new Date(
              rent.paidAt
            ).toLocaleDateString()}</span>
          </div>

          <div class="row">
            <span class="label">Transaction ID</span>
            <span class="value">${rent.transactionId || "N/A"}</span>
          </div>

          <div class="status">PAID</div>

          <div class="actions">
            <button class="btn btn-print" onclick="window.print()">Print / Save PDF</button>
            <button class="btn btn-close" onclick="window.close()">Close</button>
          </div>
        </div>
      </body>
    </html>
  `);

    slipWindow.document.close();
  };

  const { id: requestId } = useParams();
  const dispatch = useDispatch();

  const reduxState =
    useSelector((state) => state.rent.byRequest?.[requestId]) || {};

  const { loading, records = [] } = reduxState;

  // 🔥 LOCAL SOURCE OF TRUTH FOR LIST
  const [localRecords, setLocalRecords] = useState([]);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Fetch once
  useEffect(() => {
    dispatch(fetchRentPayments(requestId));
  }, [dispatch, requestId]);

  // Sync redux → local ONCE when redux updates
  useEffect(() => {
    if (records.length) {
      setLocalRecords(records);
    }
  }, [records]);

  // ---------------------------
  // HANDLE PAYMENT
  // ---------------------------
  const handlePay = async (rent) => {
    if (paying) return;
    setPaying(true);

    try {
      const orderResp = await createRentOrder({
        rentId: rent._id,
        amount: rent.amount,
        tenantId: rent.tenantId?._id ?? rent.tenantId,
        landlordId: rent.landlordId?._id ?? rent.landlordId,
        propertyId: rent.propertyId?._id ?? rent.propertyId,
        rentalRequestId: requestId,
      });

      if (!orderResp.data?.success) throw new Error();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rent.amount * 100,
        currency: "INR",
        name: "RentEase",
        description: `Rent for ${rent.month}`,
        order_id: orderResp.data.orderId,

        handler: async (response) => {
          const verifyRes = await verifyRentPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verifyRes.data?.success) throw new Error();

          const { currentRent, nextRent } = verifyRes.data;

          // ✅ UPDATE LIST LOCALLY — NO REFRESH
          setLocalRecords((prev) => {
            let updated = prev.map((r) =>
              r._id === currentRent._id ? currentRent : r
            );

            if (nextRent) updated = [...updated, nextRent];
            return updated;
          });

          setSuccessData({
            amount: currentRent.amount,
            month: currentRent.month,
            nextMonth: nextRent?.month ?? null,
          });

          setShowSuccess(true);
        },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <section className="px-6 py-12 min-h-screen bg-app">
          <PaymentHistorySkeleton />
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-app">
        <Header />

        <section className="px-6 md:px-12 lg:px-20 py-12 ">
          <PageTitle>Rent Payment History</PageTitle>

          {/* 🔥 LIST RENDERS FROM LOCAL STATE */}
          <div className="space-y-5">
            {localRecords.map((rent, index) => (
              <motion.div
                key={rent._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl bg-white shadow border"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold flex gap-2 items-center">
                      <Calendar className="w-4 h-4" />
                      {rent.month}
                    </p>

                    <p className="flex items-center gap-1 font-bold">
                      <IndianRupee className="w-4 h-4" />
                      {rent.amount}
                    </p>
                  </div>

                  {/* {rent.status === "paid" ? (
                  <span className="badge-success">PAID</span>
                ) : (
                  <button
                    disabled={paying}
                    onClick={() => handlePay(rent)}
                    className="btn-primary px-6 py-2 rounded-lg"
                  >
                    Pay ₹{rent.amount}
                  </button>
                )} */}
                  {rent.status === "paid" ? (
                    <div className="flex flex-col items-end gap-2">
                      <span className="badge-success">PAID</span>

                      <button
                        onClick={() => handlePrintSlip(rent)}
                        className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100"
                      >
                        Print / Download Slip
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={paying}
                      onClick={() => handlePay(rent)}
                      className="btn-primary px-6 py-2 rounded-lg"
                    >
                      Pay ₹{rent.amount}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <PaymentSuccessModal
            show={showSuccess}
            onClose={() => setShowSuccess(false)}
            amount={successData?.amount}
            month={successData?.month}
            nextMonth={successData?.nextMonth}
          />
        </section>
      </div>
      <Footer />
    </>
  );
}
