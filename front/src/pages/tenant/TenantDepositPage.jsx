import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchRentalRequest,
  payDeposit,
} from "../../redux/slices/rentalRequestSlice";
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

  const depositAmount = singleRequest.depositAmount;

  const handlePayDeposit = async () => {
    try {
      await dispatch(
        payDeposit({
          requestId: id,
          depositAmountPaid: depositAmount,
          monthlyRent: singleRequest.propertyId.rent,
        })
      ).unwrap();

      toast.success("Deposit paid successfully!");
      navigate(`/tenant/rental-status/${id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="px-6 py-10 min-h-screen">
      <div className="max-w-3xl mx-auto glass-card p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-900 text-center mb-6">
          Deposit Payment
        </h1>

        {/* Property Preview */}
        <img
          src={singleRequest.propertyId.images?.[0]?.url}
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

        <button
          onClick={handlePayDeposit}
          className="w-full mt-6 py-3 rounded-full glass-btn-blue text-sm font-medium"
        >
          Pay Deposit
        </button>

        <button
          onClick={() => navigate(`/tenant/rental-status/${id}`)}
          className="w-full mt-3 py-2 rounded-full text-sm glass-btn-green"
        >
          Back to Status
        </button>
      </div>
    </div>
  );
}
