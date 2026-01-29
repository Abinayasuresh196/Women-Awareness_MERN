import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all articles
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, thunkAPI) => {
    try {
      // Fetch all articles with high limit to get all articles
      const response = await api.get(`/articles?limit=1000`);
      
      // Extract articles from the response structure: { success: true, data: { articles: [...], pagination: {...} } }
      const articlesData = Array.isArray(response.data.data?.articles) ? response.data.data.articles : 
                           Array.isArray(response.data.articles) ? response.data.articles : 
                           (Array.isArray(response.data.data) ? response.data.data : []);
      
      return articlesData;
    } catch (error) {
      console.error('Error fetching articles:', error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const articleSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch articles";
      });
  },
});

export default articleSlice.reducer;
