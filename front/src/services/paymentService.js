import axios from "../api/axiosInstance";

// Create razorpay order
export const createDepositOrder = async (
  amount,
  rentalRequestId,
  tenantId,
  landlordId,
  propertyId
) => {
  return axios.post("/payment/create-order", {
    amount,
    type: "deposit",
    rentalRequestId,
    tenantId,
    landlordId,
    propertyId,
  });
};

// Verify payment after success
export const verifyPayment = async (payload) => {
  return axios.post("/payment/verify", payload);
};
