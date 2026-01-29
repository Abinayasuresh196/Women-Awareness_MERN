import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Async thunk to fetch schemes
export const fetchSchemes = createAsyncThunk(
  "schemes/fetchSchemes",
  async (_, thunkAPI) => {
    try {
      // Add cache-busting parameter to force fresh data
      const timestamp = Date.now();
      const response = await api.get(`/schemes?t=${timestamp}`);
      // Extract schemes from the response structure: { articles: [...], pagination: {...} }
      const schemesData = Array.isArray(response.data.articles) ? response.data.articles : (Array.isArray(response.data.data) ? response.data.data : []);
      return schemesData;
    } catch (error) {
      console.error('Error fetching schemes:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch schemes" }
      );
    }
  }
);

// Async thunk to add a scheme
export const addScheme = createAsyncThunk(
  "schemes/addScheme",
  async (schemeData, thunkAPI) => {
    try {
      const response = await api.post("/schemes", schemeData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to add scheme" }
      );
    }
  }
);

// Async thunk to update a scheme
export const updateScheme = createAsyncThunk(
  "schemes/updateScheme",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/schemes/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update scheme" }
      );
    }
  }
);

// Async thunk to delete a scheme
export const deleteScheme = createAsyncThunk(
  "schemes/deleteScheme",
  async (schemeId, thunkAPI) => {
    try {
      await api.delete(`/schemes/${schemeId}`);
      return schemeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete scheme" }
      );
    }
  }
);

// Async thunk to approve a scheme
export const approveScheme = createAsyncThunk(
  "schemes/approveScheme",
  async (schemeId, thunkAPI) => {
    try {
      const response = await api.patch(`/schemes/${schemeId}/approve`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to approve scheme" }
      );
    }
  }
);

const schemeSlice = createSlice({
  name: "schemes",
  initialState: {
    schemes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.loading = false;
        state.schemes = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch schemes";
      })

      // Add Scheme
      .addCase(addScheme.fulfilled, (state, action) => {
        state.schemes.push(action.payload);
      })

      // Update Scheme
      .addCase(updateScheme.fulfilled, (state, action) => {
        const index = state.schemes.findIndex(scheme => scheme._id === action.payload._id);
        if (index !== -1) {
          state.schemes[index] = action.payload;
        }
      })

      // Delete Scheme
      .addCase(deleteScheme.fulfilled, (state, action) => {
        state.schemes = state.schemes.filter(scheme => scheme._id !== action.payload);
      })

      // Approve Scheme
      .addCase(approveScheme.fulfilled, (state, action) => {
        const index = state.schemes.findIndex(scheme => scheme._id === action.payload._id);
        if (index !== -1) {
          state.schemes[index] = action.payload;
        }
      });
  },
});

export default schemeSlice.reducer;
