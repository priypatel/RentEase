import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../redux/slices/propertySlice";
import {
  createRentalRequest,
  checkRentalRequest, // ✅ NEW API
} from "../redux/slices/rentalRequestSlice";
import { toast } from "react-toastify";
import ImagePreviewModal from "../components/common/ImagePreviewModal";
import ConfirmModal from "../components/common/ConfirmModal";

export default function PropertyDetailsPage() {
  const { id } = useParams(); // propertyId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.properties);
  const { check } = useSelector((state) => state.rentalRequest); // ✅ existing request check
  const user = useSelector((state) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load all properties on first mount
  useEffect(() => {
    if (!items.length) dispatch(getAllProperties());
  }, [dispatch, items.length]);

  // NEW: Check if this tenant already sent a request
  useEffect(() => {
    if (user?.role === "tenant") {
      dispatch(checkRentalRequest(id)); // propertyId
    }
  }, [dispatch, id, user]);

  const property = items.find((p) => p._id === id);
  if (loading || !property) return <p className="p-6">Loading...</p>;

  // ◼️ Handle confirm API call
  const handleRequestConfirm = async () => {
    try {
      const depositAmount = property.rent * 2;

      const request = await dispatch(
        createRentalRequest({
          propertyId: property._id,
          tenantId: user.id,
          landlordId: property.ownerId._id,
          depositAmount,
        })
      ).unwrap();

      toast.success("Request sent successfully!");

      // Redirect to timeline page
      navigate(`/tenant/rental-status/${request._id}`);
    } catch (err) {
      toast.error(err || "Failed to send request");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen page-container">
      <div className="max-w-5xl mx-auto">
        {/* IMAGE SLIDER */}
        <div className="w-full overflow-hidden rounded-xl mb-6">
          <div className="relative w-full">
            <motion.div
              className="flex w-full"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.4 }}
            >
              {property.images.map((img, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div className="w-full aspect-[16/9] overflow-hidden rounded-xl">
                    <img
                      src={img.url}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        setShowPreview(true);
                        setCurrentIndex(i);
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Arrows */}
            {property.images?.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:scale-110 transition"
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow hover:scale-110 transition"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        {/* DETAILS */}
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

        {/* 🧩 RENT SECTION (Tenant Only) */}
        {user?.role === "tenant" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* LEFT — Landlord card */}
            <div className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg">
              <h3 className="text-xl font-semibold text-green-900">
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

              <div className="mt-5 p-3 rounded-xl bg-green-100 border border-green-300">
                <p className="text-green-900 font-medium">
                  Deposit Amount: <strong>₹{property.rent * 2}</strong>
                </p>
              </div>
            </div>

            {/* RIGHT — Request section */}
            <div className="glass-card p-6 rounded-2xl border border-white/30 shadow-lg bg-green-50/50">
              <h3 className="text-lg font-semibold text-green-800">
                Rent this Property
              </h3>

              {/* CONDITIONAL BUTTONS */}
              {/* {check?.exists ? (
                <button
                  onClick={() =>
                    navigate(`/tenant/rental-status/${check.data._id}`, {
                      replace: true,
                    })
                  }
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm glass-btn-blue flex items-center justify-center gap-2"
                >
                  View Request Status
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm glass-btn-blue flex items-center justify-center gap-2"
                >
                  Request to Rent
                </button>
              )} */}
              {/* CONDITIONAL BUTTONS */}
              {property.status === "rented" ? (
                <button
                  disabled
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm bg-gray-300 text-gray-600 cursor-not-allowed"
                >
                  Already Rented
                </button>
              ) : check?.exists ? (
                <button
                  onClick={() =>
                    navigate(`/tenant/rental-status/${check.data._id}`, {
                      replace: true,
                    })
                  }
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm glass-btn-blue flex items-center justify-center gap-2"
                >
                  View Request Status
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full mt-4 px-5 py-2.5 rounded-full text-sm glass-btn-blue flex items-center justify-center gap-2"
                >
                  Request to Rent
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      <ImagePreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        images={property.images}
        index={currentIndex}
        setIndex={setCurrentIndex}
      />

      {/* CONFIRM REQUEST POPUP */}
      <ConfirmModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRequestConfirm}
        message="Are you sure you want to send the rental request?"
        confirmText="Send Request"
      />
    </div>
  );
}
