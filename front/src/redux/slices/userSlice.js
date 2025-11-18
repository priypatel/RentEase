import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { logout } from "./authSlice";

// ===============================
// 🔹 Update Profile API (PUT /users/update)
// ===============================
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/users/update", formData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ===============================
// 🔹 Logout API (POST /users/logout)
// ===============================
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/users/logout");

      // use authSlice logout
      dispatch(logout());

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const storedAuth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedAuth?.user || null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    // ===============================
    // 🔹 Update Profile
    // ===============================
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // Update inside auth object
        const authData = JSON.parse(localStorage.getItem("auth"));

        if (authData) {
          authData.user = action.payload;
          localStorage.setItem("auth", JSON.stringify(authData));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===============================
    // 🔹 Logout
    // ===============================
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
