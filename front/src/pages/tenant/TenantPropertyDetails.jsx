import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, IndianRupee, Home } from "lucide-react";

import { getAllProperties } from "../../redux/slices/propertySlice";
import {
  createRentalRequest,
  checkRentalRequest,
} from "../../redux/slices/rentalRequestSlice";

import { toast } from "react-toastify";
import ImagePreviewModal from "../../components/common/ImagePreviewModal";
import ConfirmModal from "../../components/common/ConfirmModal";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TenantPropertyDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.properties);
  const { check } = useSelector((state) => state.rentalRequest);
  const user = useSelector((state) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => window.scrollTo(0, 0), [id]);

  useEffect(() => {
    if (!items.length) dispatch(getAllProperties());
  }, [dispatch, items.length]);

  useEffect(() => {
    if (user?.role === "tenant") dispatch(checkRentalRequest(id));
  }, [dispatch, id, user]);

  const property = items.find((p) => p._id === id);
  if (loading || !property) return <p className="p-6">Loading...</p>;

  const handleRequestConfirm = async () => {
    try {
      const request = await dispatch(
        createRentalRequest({
          propertyId: property._id,
          tenantId: user.id,
          landlordId: property.ownerId._id,
          depositAmount: property.rent * 2,
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

  return (
    <>
      <Header />

      <div className="min-h-screen px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* ---- IMAGE SLIDER ---- */}
          <div className="w-full overflow-hidden rounded-xl shadow-lg">
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

              {/* ARROWS */}
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

          {/* ---- FULL DETAILS CARD ---- */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <Home className="w-7 h-7" />
              <h1 className="text-3xl font-bold">{property.title}</h1>
            </div>

            <p className="text-gray-700 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {property.location}
            </p>
            <p className="text-gray-700 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {property.city}
            </p>

            <p className="text-primary font-bold text-2xl flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {property.rent}/month
            </p>

            {/* Status */}
            <span
              className={`badge ${
                property.status === "available"
                  ? "badge-success"
                  : "badge-danger"
              }`}
            >
              {property.status.toUpperCase()}
            </span>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* ---- TWO CARDS UNDER DETAILS ---- */}
          {user?.role === "tenant" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* LANDLORD CARD */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-primary">
                  Landlord Details
                </h3>

                <div className="mt-3 space-y-1 text-gray-700">
                  <p>
                    <strong>Name:</strong> {property.ownerId?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {property.ownerId?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {property.ownerId?.phone}
                  </p>
                </div>

                <div className="mt-5 p-4 bg-primaryLight border border-primary/40 rounded-xl text-primary font-medium">
                  Deposit Amount: <strong>₹{property.rent * 2}</strong>
                </div>
              </div>

              {/* RENT REQUEST CARD */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-primary">
                  Rent this Property
                </h3>

                {property.status === "rented" ? (
                  <button
                    disabled
                    className="w-full mt-6 btn-neutral opacity-60 cursor-not-allowed"
                  >
                    Already Rented
                  </button>
                ) : check?.exists ? (
                  <button
                    onClick={() =>
                      navigate(`/tenant/rental-status/${check.data._id}`)
                    }
                    className="w-full mt-6 btn-secondary"
                  >
                    View Request Status
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full mt-6 btn-primary"
                  >
                    Request to Rent
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>

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

      <Footer />
    </>
  );
}
