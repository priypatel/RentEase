import axios from "../api/axiosInstance";

// Create order for deposit
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

// Verify deposit payment
export const verifyPayment = (payload) =>
  axios.post("/payment/verify", payload);

// Create order for monthly rent
export const createRentOrder = (payload) =>
  axios.post("/payment/create-rent-order", payload);

// Verify monthly rent payment
export const verifyRentPayment = (payload) =>
  axios.post("/payment/verify-rent-payment", payload);
