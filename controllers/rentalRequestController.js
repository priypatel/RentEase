import RentalRequest from "../models/RentalRequest.js";
import RentPayment from "../models/RentPayment.js";
export const createRentalRequest = async (req, res) => {
  try {
    const { propertyId, tenantId, landlordId, depositAmount } = req.body;

    const request = await RentalRequest.create({
      propertyId,
      tenantId,
      landlordId,
      depositAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Rental request created successfully",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create rental request",
      error: error.message,
    });
  }
};
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body; // "approved" or "rejected"

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'",
      });
    }

    const updated = await RentalRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Rental request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message,
    });
  }
};

export const payDeposit = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { depositAmountPaid, monthlyRent } = req.body;

    const request = await RentalRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Rental request not found",
      });
    }

    // Validate monthlyRent BEFORE anything
    if (!monthlyRent) {
      return res.status(400).json({
        success: false,
        message: "monthlyRent is required to create first rent entry",
      });
    }

    // Request must be approved
    if (request.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Landlord must approve the request before paying deposit",
      });
    }

    // Deposit already paid?
    if (request.depositStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Deposit already paid",
      });
    }

    // Check deposit amount
    if (depositAmountPaid !== request.depositAmount) {
      return res.status(400).json({
        success: false,
        message: `Deposit amount mismatch. Expected ${request.depositAmount}, received ${depositAmountPaid}`,
      });
    }

    // -----------------------
    // STEP 1 -> Create Rent Entry FIRST
    // -----------------------

    const cycleDate = new Date(); // rentCycleStart
    const monthString = `${cycleDate.getFullYear()}-${String(
      cycleDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const rentRecord = await RentPayment.create({
      rentalRequestId: request._id,
      tenantId: request.tenantId,
      landlordId: request.landlordId,
      propertyId: request.propertyId,
      month: monthString,
      amount: monthlyRent,
      status: "pending",
    });

    // -----------------------
    // STEP 2 -> If rent created successfully, update deposit
    // -----------------------

    request.depositStatus = "paid";
    request.depositPaidAt = cycleDate;
    request.rentCycleStart = cycleDate;

    await request.save();

    // -----------------------
    // RESPONSE
    // -----------------------
    return res.status(200).json({
      success: true,
      message: "Deposit paid successfully & first rent entry created",
      depositData: request,
      firstRentEntry: rentRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process deposit payment",
      error: error.message,
    });
  }
};
