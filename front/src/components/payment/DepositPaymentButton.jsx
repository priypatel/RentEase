import React from "react";
import { toast } from "react-hot-toast";
import { createDepositOrder, verifyPayment } from "../../services/paymentService";

export default function DepositPaymentButton({
  depositAmount,
  rentalRequest,
  tenant,
}) {
  const handleDepositPayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const { data } = await createDepositOrder(
        depositAmount,
        rentalRequest._id,
        rentalRequest.tenantId,
        rentalRequest.landlordId,
        rentalRequest.propertyId
      );

      if (!data.success) {
        toast.error("Unable to start payment");
        return;
      }

      // 2️⃣ Open Razorpay popup
      openRazorpayPopup(data.orderId, depositAmount);

    } catch (err) {
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
      theme: { color: "#00b894" },

      handler: async function (response) {
        // 3️⃣ Verify payment (backend)
        const verifyRes = await verifyPayment(response);

        if (verifyRes.data.success) {
          toast.success("Deposit Paid Successfully");

          // Trigger UI refresh: fetch rental request status again
          if (typeof rentalRequest.refresh === "function") {
            rentalRequest.refresh();
          }
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

  return (
    <button
      className="glass-btn-green px-5 py-2 rounded-lg"
      onClick={handleDepositPayment}
    >
      Pay Deposit ₹{depositAmount}
    </button>
  );
}
