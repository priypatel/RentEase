import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentalRequest } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";

export default function RentalStatusPage() {
  const { id } = useParams(); // this is requestId
  const dispatch = useDispatch();

  const { singleRequest, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchRentalRequest(id));
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

        <div className="relative mt-12">
          <div className="absolute top-5 left-0 w-full h-1 bg-blue-200 rounded-full"></div>

          <div className="grid grid-cols-4 text-center relative z-10">
            {steps.map((step, i) => {
              const isActive = activeStep >= step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.15 },
                  }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 backdrop-blur-md 
                    ${
                      isActive
                        ? "bg-blue-500 border-blue-600 text-white shadow-lg"
                        : "bg-white/30 border-blue-300 text-blue-700"
                    }`}
                  >
                    {step.id}
                  </div>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      isActive ? "text-blue-800" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 glass-card p-6 rounded-2xl border border-white/30 shadow-lg"
        >
          {activeStep === 1 && (
            <p className="text-blue-900 font-medium text-lg">
              Your request has been sent. Waiting for the landlord to approve
              it.
            </p>
          )}

          {activeStep === 2 && (
            <p className="text-blue-900 font-medium text-lg">
              Landlord approved your request. Deposit payment will be enabled
              soon.
            </p>
          )}

          {activeStep === 3 && (
            <p className="text-blue-900 font-medium text-lg">
              Deposit is pending. Complete payment to start rent cycle.
            </p>
          )}

          {activeStep === 4 && (
            <p className="text-blue-900 font-medium text-lg">
              Deposit paid! Rent cycle is active now.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
