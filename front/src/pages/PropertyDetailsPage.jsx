import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../redux/slices/propertySlice";
import { createRentalRequest } from "../redux/slices/rentalRequestSlice";
import { toast } from "react-toastify";
import ImagePreviewModal from "../components/common/ImagePreviewModal";
import ConfirmModal from "../components/common/ConfirmModal"; // ⭐ ADD THIS

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { items, loading } = useSelector((state) => state.properties);
  const user = useSelector((state) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // ⭐ NEW STATE FOR CONFIRM POPUP
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!items.length) {
      dispatch(getAllProperties());
    }
  }, [dispatch]);

  const property = items.find((p) => p._id === id);
  const [localStatus, setLocalStatus] = useState(property?.rentalStatus);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6 text-red-600">Property not found</p>;

  const next = () =>
    setCurrentIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );

  const prev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );

  // ⭐ FINAL API CALL (AFTER CONFIRM)
  const handleRequestConfirm = async () => {
    try {
      const depositAmount = property.rent * 2;

      await dispatch(
        createRentalRequest({
          propertyId: property._id,
          tenantId: user.id,
          landlordId: property.ownerId._id,
          depositAmount,
        })
      ).unwrap();

      setLocalStatus("requested");
      toast.success("Request sent to landlord");
    } catch (err) {
      toast.error(err || "Failed to send request");
    } finally {
      setShowConfirm(false); // close modal
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* IMAGE SLIDER */}
        <div className="relative h-72 overflow-hidden rounded-xl mb-6">
          <motion.div
            className="flex h-full"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ duration: 0.4 }}
          >
            {property.images?.map((img, i) => (
              <div key={i} className="min-w-full h-72 flex-shrink-0">
                <img
                  src={img.url}
                  className="w-full h-72 object-cover rounded-xl cursor-pointer"
                  onClick={() => {
                    setShowPreview(true);
                    setCurrentIndex(i);
                  }}
                />
              </div>
            ))}
          </motion.div>

          {property.images?.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
              >
                ‹
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* CONTENT */}
        <h1 className="text-3xl font-bold">{property.title}</h1>
        <p className="text-gray-600 mt-1 text-lg">📍 {property.location}</p>
        <p className="text-green-700 font-bold text-xl mt-3">
          ₹{property.rent}/month
        </p>

        {/* Description */}
        <h3 className="text-2xl font-semibold mt-8">Description</h3>
        <p className="text-gray-700 mt-2 whitespace-pre-line">
          {property.description}
        </p>

        {/* LANDLORD DETAILS + REQUEST + DEPOSIT INFO */}
        {user?.role === "tenant" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* LANDLORD DETAILS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-green-900 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5.121 17.804A9 9 0 1119 12v1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Landlord Details
              </h3>

              <p className="mt-2 text-gray-700">
                <strong>Name:</strong> {property.ownerId?.name}
              </p>
              <p className="mt-1 text-gray-700">
                <strong>Email:</strong> {property.ownerId?.email}
              </p>
              <p className="mt-1 text-gray-700">
                <strong>Phone:</strong> {property.ownerId?.phone}
              </p>

              {/* ⭐ Deposit highlight box */}
              <div className="mt-5 p-3 rounded-xl bg-green-100 border border-green-300 flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8V4m0 0L8 8m4-4l4 4M6 12h12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 16h12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-green-900 font-medium">
                  Deposit Amount: <strong>₹{property.rent * 2}</strong> (2×
                  monthly rent)
                </p>
              </div>
            </motion.div>

            {/* REQUEST TO RENT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg bg-green-50/50"
            >
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 6v6l4 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                Rent this Property
              </h3>

              {localStatus === "requested" ? (
                <p className="text-yellow-700 font-medium mt-3">
                  Request already sent
                </p>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 glass-btn-blue"
                >
                  <svg
                    className="w-4 h-4 text-blue-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Request to Rent
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* IMAGE PREVIEW */}
      <ImagePreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        images={property.images}
        index={currentIndex}
        setIndex={setCurrentIndex}
      />

      {/* ⭐ CONFIRM POPUP BEFORE API CALL */}
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRequestConfirm}
        message="Are you sure you want to request this property?"
        confirmText="Send Request"
      />
    </div>
  );
}
