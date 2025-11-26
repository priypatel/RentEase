import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRentalRequest } from "../../redux/slices/rentalRequestSlice";
import {
  createDepositOrder,
  verifyPayment,
} from "../../services/paymentService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function TenantDepositPage() {
  const { id } = useParams(); // requestId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleRequest, loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    dispatch(fetchRentalRequest(id));
  }, [dispatch, id]);

  if (loading || !singleRequest) return <p className="p-6">Loading...</p>;

  const depositAmount =
    singleRequest.depositAmount || singleRequest.propertyId.rent * 2;
  const tenant = singleRequest.tenantId;

  // --------------------------
  // RAZORPAY PAYMENT HANDLER
  // --------------------------
  const handleDepositPayment = async () => {
    try {
      // 1️⃣ Create order in backend
      const { data } = await createDepositOrder(
        depositAmount,
        singleRequest._id,
        tenant._id,
        singleRequest.landlordId,
        singleRequest.propertyId._id
      );

      if (!data.success) {
        toast.error("Unable to initiate payment");
        return;
      }

      // 2️⃣ Open Razorpay popup
      openRazorpayPopup(data.orderId, depositAmount);
    } catch (error) {
      toast.error("Payment initialization failed");
    }
  };

  // --------------------------
  // Razorpay Popup
  // --------------------------
  const openRazorpayPopup = (orderId, amount) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount: amount * 100,
      currency: "INR",
      name: "RentEase",
      description: "Deposit Payment",
      theme: { color: "#00b894" },

      handler: async function (response) {
        const res = await verifyPayment(response);

        if (res.data.success) {
          toast.success("Deposit Paid Successfully!");

          // Refresh rental request
          dispatch(fetchRentalRequest(id));

          // Go back to status page
          navigate(`/tenant/rental-status/${id}`);
        } else {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name: tenant.name,
        email: tenant.email,
        contact: tenant.phone || "9999999999",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // --------------------------

  return (
    <div className="px-0 py-0 sm:px-6 sm:py-10 min-h-screen">
      <div className="max-w-3xl mx-auto glass-card p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-900 text-center mb-6">
          Deposit Payment
        </h1>

        {/* Property Preview */}
        <img
          src={singleRequest.propertyId.images?.[0]?.url || ""}
          className="w-full h-56 object-cover rounded-xl"
        />

        <div className="mt-5">
          <h2 className="text-xl font-semibold text-green-900">
            {singleRequest.propertyId.title}
          </h2>
          <p className="text-gray-700">{singleRequest.propertyId.location}</p>

          <p className="text-green-700 font-bold mt-2">
            Deposit Amount: ₹{depositAmount}
          </p>
        </div>

        {/* PAYMENT + BACK BUTTONS SIDE BY SIDE */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleDepositPayment}
            className="flex-1 py-3 rounded-full glass-btn-blue text-sm font-medium"
          >
            Pay Deposit
          </button>

          <button
            onClick={() => navigate(`/tenant/rental-status/${id}`)}
            className="flex-1 py-3 rounded-full glass-btn-green text-sm font-medium"
          >
            Back to Status
          </button>
        </div>
      </div>
    </div>
  );
}
