import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ==========================
//  Fetch Rent Records
// ==========================
export const fetchRentPayments = createAsyncThunk(
  "rent/fetchRentPayments",
  async (requestId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/rent-payment/by-request/${requestId}`
      );

      return { requestId, data: res.data.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

// ==========================
//  Pay Monthly Rent
// ==========================
export const payRent = createAsyncThunk(
  "rent/payRent",
  async ({ rentId, amountPaid }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/rent-payment/pay/${rentId}`, {
        amountPaid,
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: err.message }
      );
    }
  }
);

// ==========================
// ★ GET PAYMENTS FOR LANDLORD
// ==========================
export const getPaymentsForLandlord = createAsyncThunk(
  "rent/landlordPayments",
  async (landlordId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/rent-payment/landlord/${landlordId}`
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ==========================
// ★ GET LANDLORD SUMMARY
// ==========================
export const getPaymentsSummary = createAsyncThunk(
  "rent/landlordSummary",
  async (landlordId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/rent-payment/landlord/${landlordId}/summary`
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const rentSlice = createSlice({
  name: "rent",
  initialState: {
    loading: false,
    error: null,
    byRequest: {},
    landlordPayments: [],
    landlordSummary: {},
  },

  reducers: {
    clearRentForRequest: (state, action) => {
      delete state.byRequest[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rents
      .addCase(fetchRentPayments.pending, (state, action) => {
        const requestId = action.meta.arg;
        state.byRequest[requestId] = {
          loading: true,
          error: null,
          records: [],
        };
      })
      .addCase(fetchRentPayments.fulfilled, (state, action) => {
        const { requestId, data } = action.payload;
        state.byRequest[requestId] = {
          loading: false,
          error: null,
          records: data,
        };
      })
      .addCase(fetchRentPayments.rejected, (state, action) => {
        const requestId = action.meta.arg;
        state.byRequest[requestId] = {
          loading: false,
          error: action.payload?.message,
          records: [],
        };
      })
      // Pay rent
      .addCase(payRent.fulfilled, (state, action) => {
        const { currentRent, nextRent } = action.payload;
        const requestId = currentRent?.rentalRequestId;

        if (!state.byRequest[requestId]) return;

        // Update current rent
        state.byRequest[requestId].records = state.byRequest[
          requestId
        ].records.map((r) => (r._id === currentRent._id ? currentRent : r));

        // Add next month rent
        if (nextRent) {
          state.byRequest[requestId].records.push(nextRent);
        }
      });
    builder
      .addCase(getPaymentsForLandlord.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentsForLandlord.fulfilled, (state, action) => {
        state.loading = false;
        state.landlordPayments = action.payload;
      })
      .addCase(getPaymentsForLandlord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(getPaymentsSummary.fulfilled, (state, action) => {
      state.landlordSummary = action.payload;
    });
  },
});

export const { clearRentForRequest } = rentSlice.actions;
export default rentSlice.reducer;
