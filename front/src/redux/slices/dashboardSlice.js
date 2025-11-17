// src/redux/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getLandlordStats = createAsyncThunk(
  "dashboard/getLandlordStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/dashboard/landlord-stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      totalProperties: 0,
      activeTenants: 0,
      monthlyIncome: 0,
      pendingRents: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLandlordStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLandlordStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload || state.stats;
      })
      .addCase(getLandlordStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
