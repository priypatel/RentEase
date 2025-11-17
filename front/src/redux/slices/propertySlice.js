// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "../../api/axiosInstance";

// // GET MY PROPERTIES
// export const getMyProperties = createAsyncThunk(
//   "properties/getMyProperties",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.get("/properties/my-properties");
//       return res.data.properties;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// // CREATE
// export const createProperty = createAsyncThunk(
//   "properties/createProperty",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.post("/properties", formData);
//       return res.data.property;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// // UPDATE
// export const updateProperty = createAsyncThunk(
//   "properties/updateProperty",
//   async ({ id, formData }, { rejectWithValue }) => {
//     try {
//       const res = await axiosInstance.put(`/properties/${id}`, formData);
//       return res.data.property;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// // DELETE
// export const deleteProperty = createAsyncThunk(
//   "properties/deleteProperty",
//   async (id, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`/properties/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );

// const propertySlice = createSlice({
//   name: "properties",
//   initialState: {
//     items: [],
//     loading: false,
//     creating: false,
//     updating: false,
//     deleting: false,
//     error: null,
//   },

//   extraReducers: (builder) => {
//     builder

//       // LOAD
//       .addCase(getMyProperties.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getMyProperties.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })

//       // CREATE
//       .addCase(createProperty.pending, (state) => {
//         state.creating = true;
//       })
//       .addCase(createProperty.fulfilled, (state, action) => {
//         state.creating = false;
//         state.items.push(action.payload);
//       })

//       // UPDATE
//       .addCase(updateProperty.pending, (state) => {
//         state.updating = true;
//       })
//       .addCase(updateProperty.fulfilled, (state, action) => {
//         state.updating = false;
//         const i = state.items.findIndex((p) => p._id === action.payload._id);
//         if (i !== -1) state.items[i] = action.payload;
//       })

//       // DELETE
//       .addCase(deleteProperty.pending, (state) => {
//         state.deleting = true;
//       })
//       .addCase(deleteProperty.fulfilled, (state, action) => {
//         state.deleting = false;
//         state.items = state.items.filter((p) => p._id !== action.payload);
//       });
//   },
// });

// export default propertySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getMyProperties = createAsyncThunk(
  "properties/getMyProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/properties/my-properties");
      return res.data.properties;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/createProperty",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/properties", formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/properties/${id}`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "properties/deleteProperty",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/properties/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState: {
    items: [],
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
      // GET MY PROPERTIES
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
      // CREATE PROPERTY
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
      // UPDATE PROPERTY (THIS WAS BROKEN)
      // ==========================================
      .addCase(updateProperty.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.updating = false;

        const index = state.items.findIndex(
          (p) => p._id === action.payload._id
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
  },
});

export default propertySlice.reducer;
