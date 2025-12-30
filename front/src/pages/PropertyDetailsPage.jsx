import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAllProperties } from "../redux/slices/propertySlice";
import {
  createRentalRequest,
  checkRentalRequest,
} from "../redux/slices/rentalRequestSlice";

import { toast } from "react-toastify";
import ImagePreviewModal from "../components/common/ImagePreviewModal";
import ConfirmModal from "../components/common/ConfirmModal";

import { MapPin, IndianRupee, Home } from "lucide-react";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.properties);
  const { check } = useSelector((state) => state.rentalRequest);
  const user = useSelector((state) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!items.length) dispatch(getAllProperties());
  }, [dispatch, items.length]);

  useEffect(() => {
    if (user?.role === "tenant") {
      dispatch(checkRentalRequest(id));
    }
  }, [dispatch, id, user]);

  const property = items.find((p) => p._id === id);
  if (loading || !property) return <p className="p-6">Loading...</p>;

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
      navigate(`/tenant/rental-status/${request._id}`);
    } catch (err) {
      toast.error(err || "Failed to send request");
    } finally {
      setShowConfirm(false);
    }
  };
  const getImageUrl = (url) => {
    if (!url) return "";
    return url.replace("http://localhost:5005", "");
  };

  return (
    <div className="min-h-screen page-container">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* ---------------------- IMAGE SLIDER ---------------------- */}
        <div className="w-full overflow-hidden rounded-2xl shadow-lg">
          <div className="relative w-full">
            <motion.div
              className="flex w-full"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.4 }}
            >
              {property.images.map((img, i) => (
                <div key={i} className="w-full flex-shrink-0">
                  <div className="w-full aspect-[16/9] overflow-hidden rounded-2xl">
                    <img
                      src={img.url}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        setShowPreview(true);
                        setCurrentIndex(i);
                      }}
                    />
                    {/* <img
                      src={getImageUrl(img.url)}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => {
                        setShowPreview(true);
                        setCurrentIndex(i);
                      }}
                    /> */}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow hover:scale-110 transition"
                >
                  ‹
                </button>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-3 rounded-full shadow hover:scale-110 transition"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>

        {/* ---------------------- FULL DETAILS CARD ---------------------- */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition space-y-5">
          <div className="flex items-center gap-3 text-primary">
            <Home className="w-7 h-7" />
            <h1 className="text-3xl font-bold">{property.title}</h1>
          </div>

          <div className="flex items-center text-gray-700 text-lg gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {property.location}
          </div>
          <div className="flex items-center text-gray-700 text-lg gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {property.city}
          </div>

          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <IndianRupee className="w-5 h-5" />
            {property.rent}/month
          </div>

          <span
            className={`badge ${
              property.status === "available" ? "badge-success" : "badge-danger"
            }`}
          >
            {property.status.toUpperCase()}
          </span>

          {/* Basic Property Info */}
          {property.bedrooms || property.size ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 mt-4">
              {property.bedrooms && (
                <p>
                  <strong>Bedrooms:</strong> {property.bedrooms}
                </p>
              )}
              {property.bathrooms && (
                <p>
                  <strong>Bathrooms:</strong> {property.bathrooms}
                </p>
              )}
              {property.size && (
                <p>
                  <strong>Size:</strong> {property.size} sq.ft
                </p>
              )}
            </div>
          ) : null}

          {/* Description inside card */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ImagePreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        images={property.images}
        index={currentIndex}
        setIndex={setCurrentIndex}
      />

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
