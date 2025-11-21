import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// ----------------------
// 1) CREATE RENTAL REQUEST
// ----------------------
export const createRentalRequest = createAsyncThunk(
  "rentalRequest/create",
  async (
    { propertyId, tenantId, landlordId, depositAmount },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/rental-request/create", {
        propertyId,
        tenantId,
        landlordId,
        depositAmount,
      });

      if (!res.data.success) {
        return rejectWithValue(res.data.message || "Failed");
      }

      return res.data.data; // return request object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ----------------------
// 2) APPROVAL UPDATE (for later use)
// ----------------------
export const updateRequestStatus = createAsyncThunk(
  "rentalRequest/updateStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/rental-request/status/${requestId}`, {
        status,
      });
      if (!res.data.success) return rejectWithValue(res.data.message);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ----------------------
// 3) PAY DEPOSIT API
// ----------------------
export const payDeposit = createAsyncThunk(
  "rentalRequest/payDeposit",
  async (
    { requestId, depositAmountPaid, monthlyRent },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`/rental-request/deposit/${requestId}`, {
        depositAmountPaid,
        monthlyRent,
      });

      if (!res.data.success) return rejectWithValue(res.data.message);

      return {
        request: res.data.depositData,
        firstRent: res.data.firstRentEntry,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Deposit failed");
    }
  }
);

// ----------------------
// 4) FETCH BY PROPERTY
// ----------------------
export const fetchRentalRequest = createAsyncThunk(
  "rentalRequest/fetchOne",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/rental-request/${requestId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  }
);

// ----------------------
// SLICE
// ----------------------
const rentalRequestSlice = createSlice({
  name: "rentalRequest",
  initialState: {
    loading: false,
    error: null,
    requestData: null,
    singleRequest: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // CREATE REQUEST
    builder
      .addCase(createRentalRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRentalRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requestData = action.payload; // ← saved request object
        state.error = null;
      })
      .addCase(createRentalRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // UPDATE STATUS (LANDLORD SIDE)
    builder.addCase(updateRequestStatus.fulfilled, (state, action) => {
      state.requestData = action.payload;
    });

    // PAY DEPOSIT
    builder
      .addCase(payDeposit.pending, (state) => {
        state.loading = true;
      })
      .addCase(payDeposit.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.requestData = action.payload.request; // updated request
      })
      .addCase(payDeposit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH BY PROPERTY
    builder
      .addCase(fetchRentalRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRentalRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.singleRequest = action.payload;
      })
      .addCase(fetchRentalRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default rentalRequestSlice.reducer;
