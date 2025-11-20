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

        {/* LANDLORD DETAILS (Tenant only) */}
        {user?.role === "tenant" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-xl border">
            <h3 className="text-xl font-semibold">Landlord Details</h3>
            <p className="mt-1">
              <strong>Name:</strong> {property.ownerId?.name}
            </p>
            <p className="mt-1">
              <strong>Email:</strong> {property.ownerId?.email}
            </p>
            <p className="mt-1">
              <strong>Phone:</strong> {property.ownerId?.phone}
            </p>
          </div>
        )}

        {/* REQUEST SECTION */}
        {user?.role === "tenant" && (
          <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="text-lg font-semibold text-green-800">
              Rent this Property
            </h3>

            {localStatus === "requested" ? (
              <p className="text-yellow-700 font-medium mt-2">
                Request already sent
              </p>
            ) : (
              <button
                onClick={() => setShowConfirm(true)} // ⭐ CHANGE HERE
                className="mt-3 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Request to Rent
              </button>
            )}
          </div>
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
