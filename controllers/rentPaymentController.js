import RentPayment from "../models/RentPayment.js";

// export const payMonthlyRent = async (req, res) => {
//   try {
//     const { rentId } = req.params;
//     const { amountPaid } = req.body;

//     const rent = await RentPayment.findById(rentId);

//     if (!rent) {
//       return res.status(404).json({
//         success: false,
//         message: "Rent record not found",
//       });
//     }

//     // Check already paid
//     if (rent.status === "paid") {
//       return res.status(400).json({
//         success: false,
//         message: "Rent already paid",
//       });
//     }

//     // Validate amount
//     if (amountPaid !== rent.amount) {
//       return res.status(400).json({
//         success: false,
//         message: `Amount mismatch. Expected ${rent.amount}, received ${amountPaid}`,
//       });
//     }

//     // Mark as paid
//     rent.status = "paid";
//     rent.paidAt = new Date();

//     await rent.save();

//     return res.status(200).json({
//       success: true,
//       message: "Monthly rent paid successfully",
//       data: rent,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to pay monthly rent",
//       error: error.message,
//     });
//   }
// };

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

    const rents = await RentPayment.find({ rentalRequestId: requestId }).sort({
      createdAt: 1,
    }); // oldest first

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
