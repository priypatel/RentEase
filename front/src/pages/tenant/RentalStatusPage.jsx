import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentalRequest } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";

export default function RentalStatusPage() {
  const { id } = useParams(); // this is requestId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleRequest, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRentalRequest(id)); // ✅ Correct updated API
    }
  }, [dispatch, id]);

  if (loading || !singleRequest) {
    return <p className="p-6 text-gray-600">Loading status...</p>;
  }

  const status = singleRequest.status;
  const depositPaid = singleRequest.depositStatus === "paid";

  const getActiveStep = () => {
    if (status === "requested") return 1;
    if (status === "approved" && !depositPaid) return 2;
    if (status === "approved" && depositPaid) return 3;
    return 4;
  };

  const activeStep = getActiveStep();

  const steps = [
    { id: 1, label: "Request Sent" },
    { id: 2, label: "Landlord Approval" },
    { id: 3, label: "Deposit Payment" },
    { id: 4, label: "Rent Cycle Started" },
  ];

  return (
    <div className="px-6 py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-900 text-center"
        >
          Rental Request Status
        </motion.h1>

        {/* Back to property */}
        <button
          onClick={() =>
            navigate(`/tenant/property/${singleRequest.propertyId._id}`, {
              replace: true,
            })
          }
          className="mt-6 mb-4 px-4 py-2 rounded-full text-sm glass-btn-blue flex items-center gap-2"
        >
          ← Back to Property
        </button>

        {/* Timeline */}
        {/* ---- IMPROVED TIMELINE ---- */}
        <div className="relative mt-14">
          {/* Background Line */}
          <div className="absolute top-[22px] left-0 w-full h-[3px] bg-blue-200/60 rounded-full"></div>

          <div className="grid grid-cols-4 relative z-10">
            {steps.map((step, i) => {
              const isActive = activeStep >= step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center"
                >
                  {/* circle */}
                  <div
                    className={`
              w-12 h-12 flex items-center justify-center rounded-full border-[3px] 
              transition-all duration-300 
              ${
                isActive
                  ? "bg-blue-600 border-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.45)] scale-105"
                  : "bg-white border-blue-300 text-blue-700"
              }
            `}
                  >
                    {step.id}
                  </div>

                  {/* label */}
                  <p
                    className={`mt-3 text-sm font-semibold 
              ${isActive ? "text-blue-800" : "text-gray-500"}
            `}
                  >
                    {step.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Status info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 glass-card p-6 rounded-2xl border border-white/30 shadow-lg"
        >
          {activeStep === 1 && (
            <p className="text-blue-900 font-medium text-lg">
              Your request has been sent. Waiting for approval.
            </p>
          )}
          {activeStep === 2 && (
            <p className="text-blue-900 font-medium text-lg">
              Landlord approved your request. Deposit will be enabled soon.
            </p>
          )}
          {activeStep === 3 && (
            <p className="text-blue-900 font-medium text-lg">
              Your deposit is pending. Pay soon to start rent cycle.
            </p>
          )}
          {activeStep === 4 && (
            <p className="text-blue-900 font-medium text-lg">
              Rent cycle started. Enjoy your stay!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
