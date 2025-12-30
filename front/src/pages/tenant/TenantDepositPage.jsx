import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRentalRequest } from "../../redux/slices/rentalRequestSlice";
import {
  createDepositOrder,
  verifyPayment,
} from "../../services/paymentService";
import { toast } from "react-toastify";

import { Home, MapPin, IndianRupee } from "lucide-react";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

export default function TenantDepositPage() {
  const { id } = useParams();
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

  const property = singleRequest.propertyId;
  const tenant = singleRequest.tenantId;

  const handleDepositPayment = async () => {
    try {
      const { data } = await createDepositOrder(
        depositAmount,
        singleRequest._id,
        tenant._id,
        singleRequest.landlordId,
        property._id
      );

      if (!data.success) return toast.error("Unable to initiate payment");

      openRazorpayPopup(data.orderId, depositAmount);
    } catch (error) {
      toast.error("Payment initialization failed");
    }
  };

  const openRazorpayPopup = (orderId, amount) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount: amount * 100,
      currency: "INR",
      name: "RentEase",
      description: "Deposit Payment",
      theme: { color: "#2ECC71" },

      handler: async function (response) {
        // const res = await verifyPayment(response);
        // if (res.data.success) {
        //   toast.success("Deposit Paid Successfully!");
        //   dispatch(fetchRentalRequest(id));
        //   navigate(`/tenant/rental-status/${id}`);
        // } else toast.error("Payment verification failed");
        try {
          const res = await verifyPayment(response);
          console.log("Verify response:", res.data);
        } catch (err) {
          console.error("Verify error:", err.response?.data || err);
        }
      },

      prefill: {
        name: tenant.name,
        email: tenant.email,
        contact: tenant.phone || "9999999999",
      },
    };

    new window.Razorpay(options).open();
  };

  return (
    <>
      <Header />

      <div className="page-container min-h-screen bg-app">
        {/* Main Card (Matches Property Details UI) */}
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition">
          {/* Title Row With Icon */}
          <div className="flex items-center gap-3 text-primary mb-6">
            <Home className="w-7 h-7" />
            <h1 className="text-3xl font-bold">Deposit Payment</h1>
          </div>

          {/* Property Preview */}
          <img
            src={property.images?.[0]?.url || ""}
            className="w-full h-56 object-cover rounded-xl"
          />

          {/* Property Details Section */}
          <div className="mt-5 space-y-2">
            <h2 className="text-xl font-semibold text-primaryDark flex items-center gap-2">
              <Home className="w-5 h-5" />
              {property.title}
            </h2>

            <p className="text-grayText flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {property.location}
            </p>

            <p className="text-primary font-bold text-xl flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {depositAmount}
            </p>
          </div>

          {/* Payment Buttons */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              onClick={handleDepositPayment}
              className="flex-1 py-3 rounded-xl btn-primary text-sm font-medium"
            >
              Pay Deposit
            </button>

            <button
              onClick={() => navigate(`/tenant/rental-status/${id}`)}
              className="flex-1 py-3 rounded-xl btn-neutral text-sm font-medium"
            >
              Back to Status
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
