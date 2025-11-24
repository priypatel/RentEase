import RentPayment from "../models/RentPayment.js";
import mongoose from "mongoose";
export const payMonthlyRent = async (req, res) => {
  try {
    const { rentId } = req.params;
    const { amountPaid } = req.body; // monthlyRent removed

    const rent = await RentPayment.findById(rentId);

    if (!rent) {
      return res.status(404).json({
        success: false,
        message: "Rent record not found",
      });
    }

    // Check already paid
    if (rent.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Rent already paid",
      });
    }

    // Validate amount
    if (amountPaid !== rent.amount) {
      return res.status(400).json({
        success: false,
        message: `Amount mismatch. Expected ${rent.amount}, received ${amountPaid}`,
      });
    }

    // Mark current rent as paid
    rent.status = "paid";
    rent.paidAt = new Date();
    await rent.save();

    // ----------------------------------------------------
    // AUTO GENERATE NEXT MONTH RENT (NO monthlyRent)
    // ----------------------------------------------------

    const [year, month] = rent.month.split("-").map(Number);

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const nextMonthString = `${nextYear}-${String(nextMonth).padStart(2, "0")}`;

    // Use SAME amount as current rent
    const nextMonthAmount = rent.amount;

    const nextRent = await RentPayment.create({
      rentalRequestId: rent.rentalRequestId,
      tenantId: rent.tenantId,
      landlordId: rent.landlordId,
      propertyId: rent.propertyId,
      month: nextMonthString,
      amount: nextMonthAmount,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Rent paid & next month's rent generated",
      currentRent: rent,
      nextRent: nextRent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to pay monthly rent",
      error: error.message,
    });
  }
};

export const getRentPaymentsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const rents = await RentPayment.find({ rentalRequestId: requestId })
      .populate("tenantId", "name email phone")
      .populate("propertyId", "title location images rent")
      .sort({ createdAt: 1 });

    if (rents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rent records found for this request",
      });
    }

    return res.status(200).json({
      success: true,
      totalMonths: rents.length,
      data: rents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rent records",
      error: error.message,
    });
  }
};
/**
 * Get all rent payments for a landlord
 * GET /api/rent-payment/landlord/:landlordId
 */
export const getPaymentsForLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;

    // fetch payments and populate tenant and property basic info
    const payments = await RentPayment.find({ landlordId })
      .populate("tenantId", "name email phone")
      .populate("propertyId", "title location rent images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (err) {
    console.error("getPaymentsForLandlord:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch landlord payments",
      error: err.message,
    });
  }
};

/**
 * Get landlord payments summary
 * GET /api/rent-payment/landlord/:landlordId/summary
 */
export const getPaymentsSummaryForLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;

    // fetch counts/aggregates using aggregation pipeline for performance
    const summary = await RentPayment.aggregate([
      {
        $match: {
          landlordId: { $eq: new mongoose.Types.ObjectId(landlordId) },
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // convert aggregation result into desired shape
    let totalIncome = 0;
    let pendingCount = 0;
    let totalRecords = 0;

    summary.forEach((row) => {
      totalRecords += row.count;
      if (row._id === "paid") totalIncome = row.totalAmount || 0;
      if (row._id === "pending") pendingCount = row.count || 0;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        pendingCount,
        totalRecords,
      },
    });
  } catch (err) {
    console.error("getPaymentsSummaryForLandlord:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch landlord payments summary",
      error: err.message,
    });
  }
};
