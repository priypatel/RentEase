import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRentalRequest } from "../../redux/slices/rentalRequestSlice";
import { motion } from "framer-motion";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function RentalStatusPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { singleRequest, loading } = useSelector(
    (state) => state.rentalRequest
  );

  const [step, setStep] = useState(1);

  // FETCH DATA
  useEffect(() => {
    if (id) dispatch(fetchRentalRequest(id));
  }, [dispatch, id, location.key]);

  // ---- STEP LOGIC ----
  const getBackendStep = () => {
    const status = singleRequest?.status;
    const depositPaid = singleRequest?.depositStatus === "paid";

    if (status === "requested") return 1;
    if (status === "approved" && !depositPaid) return 2;
    if (status === "approved" && depositPaid) return 3;

    return 4;
  };

  useEffect(() => {
    if (singleRequest) setStep(getBackendStep());
  }, [singleRequest]);

  if (loading || !singleRequest)
    return (
      <>
        <Header />
        <p className="p-6 text-gray-600">Loading status...</p>
        <Footer />
      </>
    );

  const backendStep = getBackendStep();

  const goPrevious = () => setStep((prev) => Math.max(1, prev - 1));

  const goNext = () => {
    if (step === 1) return setStep(2);
    if (step === 2 && backendStep >= 2) return setStep(3);
    if (step === 3 && backendStep >= 3) return setStep(4);
  };

  const nextDisabled =
    (step === 2 && backendStep < 2) ||
    (step === 3 && backendStep < 3) ||
    step === 4;

  const steps = [
    { id: 1, label: "Request Created" },
    { id: 2, label: "Waiting for Approval" },
    { id: 3, label: "Deposit Payment" },
    { id: 4, label: "Rent Started" },
  ];

  return (
    <>
      <Header />

      <section className="px-6 md:px-12 lg:px-20 py-12 bg-[#F7FFF9] min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#046c4a] text-center mb-8"
          >
            Rental Request Status
          </motion.h1>

          {/* PREVIOUS + NEXT BUTTONS */}
          <div className="flex justify-between gap-4 mb-12">
            <button
              onClick={goPrevious}
              disabled={step === 1}
              className={`px-6 py-2 rounded-full text-sm glass-btn-green ${
                step === 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Previous Step
            </button>

            <button
              onClick={goNext}
              disabled={nextDisabled}
              className={`px-6 py-2 rounded-full text-sm glass-btn-blue ${
                nextDisabled ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Next Step
            </button>
          </div>

          {/* TIMELINE */}
          <div className="relative mt-4 mb-14">
            <div className="absolute top-[22px] left-0 w-full h-[3px] bg-green-200/60 rounded-full"></div>

            <div className="grid grid-cols-4 relative z-10">
              {steps.map((s, i) => {
                const forcedActive =
                  (s.id === 1 || s.id === 2) && backendStep === 1;
                const isActive = forcedActive || step >= s.id;

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-full border-[3px] ${
                        isActive
                          ? "bg-green-600 border-green-700 text-white shadow-md scale-105"
                          : "bg-white border-green-300 text-green-700"
                      }`}
                    >
                      {s.id}
                    </div>

                    <p
                      className={`mt-3 text-sm font-semibold ${
                        isActive ? "text-green-800" : "text-gray-500"
                      }`}
                    >
                      {s.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* STATUS BOX */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 glass-card p-6 rounded-2xl border border-white/30 shadow-lg"
          >
            {step === 1 && (
              <p className="text-green-900 font-medium text-lg">
                Your rental request has been created.
              </p>
            )}

            {step === 2 && (
              <p className="text-green-900 font-medium text-lg">
                {backendStep === 1
                  ? "Waiting for landlord approval..."
                  : "✔ Landlord approved your request."}
              </p>
            )}

            {step === 3 && (
              <div>
                <p className="text-green-900 font-medium text-lg">
                  Please pay your deposit to continue.
                </p>

                <button
                  onClick={() =>
                    navigate(`/tenant/deposit/${singleRequest._id}`)
                  }
                  className="mt-5 px-5 py-2.5 rounded-full glass-btn-blue text-sm font-semibold"
                >
                  Proceed to Deposit
                </button>
              </div>
            )}

            {step === 4 && (
              <p className="text-green-900 font-medium text-lg">
                Rent cycle started. Enjoy your stay!
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
