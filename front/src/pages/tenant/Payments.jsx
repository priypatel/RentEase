import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenantRequests } from "../../redux/slices/rentalRequestSlice";
import { useNavigate } from "react-router-dom";

export default function Payments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tenantRequests = [], loading } = useSelector(
    (state) => state.rentalRequest
  );

  useEffect(() => {
    dispatch(fetchTenantRequests());
  }, [dispatch]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-green-800 mb-4">Payments</h2>

      <div className="grid gap-4">
        {tenantRequests.length === 0 && (
          <p className="text-green-700">No rented properties found.</p>
        )}

        {tenantRequests.map((req) => (
          <div
            key={req._id}
            className="bg-white/40 backdrop-blur-lg border rounded-xl shadow p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition"
            onClick={() => navigate(`/tenant/payments/${req._id}`)}
          >
            <h3 className="text-xl font-semibold text-green-900">
              {req.propertyId.title}
            </h3>
            <p className="text-green-700">{req.propertyId.location}</p>

            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-lg ${
                  req.depositStatus === "paid"
                    ? "bg-green-300/70 text-green-900"
                    : "bg-yellow-300/70 text-yellow-900"
                }`}
              >
                Deposit: {req.depositStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
