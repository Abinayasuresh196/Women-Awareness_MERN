import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchLaws = createAsyncThunk(
  "laws/fetchLaws",
  async (_, thunkAPI) => {
    try {
      // Add cache-busting parameter to force fresh data
      const timestamp = Date.now();
      const response = await api.get(`/laws?t=${timestamp}`);
      // Extract laws from the response structure: { articles: [...], pagination: {...} }
      const lawsData = Array.isArray(response.data.articles) ? response.data.articles : (Array.isArray(response.data.data) ? response.data.data : []);
      return lawsData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch laws" }
      );
    }
  }
);

export const addLaw = createAsyncThunk(
  "laws/addLaw",
  async (lawData, thunkAPI) => {
    try {
      const response = await api.post("/laws", lawData);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to add law" }
      );
    }
  }
);

export const updateLaw = createAsyncThunk(
  "laws/updateLaw",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put(`/laws/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update law" }
      );
    }
  }
);

export const deleteLaw = createAsyncThunk(
  "laws/deleteLaw",
  async (lawId, thunkAPI) => {
    try {
      await api.delete(`/laws/${lawId}`);
      return lawId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete law" }
      );
    }
  }
);

export const approveLaw = createAsyncThunk(
  "laws/approveLaw",
  async (lawId, thunkAPI) => {
    try {
      const response = await api.patch(`/laws/${lawId}/approve`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to approve law" }
      );
    }
  }
);

const lawSlice = createSlice({
  name: "laws",
  initialState: {
    laws: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaws.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaws.fulfilled, (state, action) => {
        state.loading = false;
        state.laws = action.payload;
      })
      .addCase(fetchLaws.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch laws";
      })
      .addCase(addLaw.fulfilled, (state, action) => {
        state.laws.push(action.payload);
      })
      .addCase(updateLaw.fulfilled, (state, action) => {
        const index = state.laws.findIndex(
          (law) => law._id === action.payload._id
        );
        if (index !== -1) {
          state.laws[index] = action.payload;
        }
      })
      .addCase(deleteLaw.fulfilled, (state, action) => {
        state.laws = state.laws.filter((law) => law._id !== action.payload);
      })
      .addCase(approveLaw.fulfilled, (state, action) => {
        const index = state.laws.findIndex(
          (law) => law._id === action.payload._id
        );
        if (index !== -1) {
          state.laws[index] = action.payload;
        }
      });
  },
});

export default lawSlice.reducer;
