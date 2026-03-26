import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ==========================================
// GET ALL PROPERTIES (PUBLIC / TENANT)
// ==========================================
export const getAllProperties = createAsyncThunk(
  "properties/getAllProperties",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/properties?page=${page}&limit=${limit}`,
      );
      // return res.data.properties;
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
// ==========================================
// SEARCH PROPERTIES (PUBLIC)
// ==========================================
export const searchProperties = createAsyncThunk(
  "properties/searchProperties",
  async ({ query, page, limit }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/properties/search?query=${query}&page=${page}&limit=${limit}`,
      );
      return res.data || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ==========================================
// GET MY PROPERTIES (LANDLORD)
// ==========================================
export const getMyProperties = createAsyncThunk(
  "properties/getMyProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/properties/my-properties");
      return res.data.properties;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ==========================================
// CREATE PROPERTY
// ==========================================
export const createProperty = createAsyncThunk(
  "properties/createProperty",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/properties", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ==========================================
// UPDATE PROPERTY
// ==========================================
export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/properties/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ==========================================
// DELETE PROPERTY
// ==========================================
export const deleteProperty = createAsyncThunk(
  "properties/deleteProperty",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/properties/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// ==========================================
// SLICE
// ==========================================
const propertySlice = createSlice({
  name: "properties",
  initialState: {
    items: [],
    pagination: null,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==========================================
      // GET ALL PROPERTIES (TENANT)
      // ==========================================
      .addCase(getAllProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.properties;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllProperties.rejected, (state) => {
        state.loading = false;
      })

      // ==========================================
      // GET MY PROPERTIES (LANDLORD)
      // ==========================================
      .addCase(getMyProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getMyProperties.rejected, (state) => {
        state.loading = false;
      })

      // ==========================================
      // CREATE
      // ==========================================
      .addCase(createProperty.pending, (state) => {
        state.creating = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.creating = false;
        state.items.push(action.payload);
      })
      .addCase(createProperty.rejected, (state) => {
        state.creating = false;
      })

      // ==========================================
      // UPDATE
      // ==========================================
      .addCase(updateProperty.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.updating = false;

        const index = state.items.findIndex(
          (p) => p._id === action.payload._id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state) => {
        state.updating = false;
      })

      // ==========================================
      // DELETE
      // ==========================================
      .addCase(deleteProperty.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state) => {
        state.deleting = false;
      });
    // ==========================================
    // SEARCH
    // ==========================================
    builder
      .addCase(searchProperties.pending, (state, action) => {
        // If searching AND page=1 → new search → show skeleton
        // If searching but page>1 (pagination) → keep previous results
        const isNewSearch = action.meta.arg.page === 1;

        if (isNewSearch) {
          state.loading = true;
          state.items = []; // clear only on new search (page=1)
        }
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.properties; // override list with search results
        state.pagination = action.payload.pagination;
      })
      .addCase(searchProperties.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default propertySlice.reducer;
