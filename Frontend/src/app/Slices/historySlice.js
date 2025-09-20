import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../helpers/axios.helper";

// Fetch user's watch history
export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/history");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch history"
      );
    }
  }
);

// Add video to watch history
export const addToHistory = createAsyncThunk(
  "history/addToHistory",
  async (videoId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/history", { videoId });
      return { videoId, ...data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to history"
      );
    }
  }
);
// Remove specific video from history (API)
export const removeHistoryItem = createAsyncThunk(
  "history/removeHistoryItem",
  async (videoId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/history/${videoId}`);
      return videoId; // return for reducer to update state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove video from history"
      );
    }
  }
);

// Clear all history (API)
export const clearHistory = createAsyncThunk(
  "history/clearHistory",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/history");
      return true; // nothing to return, just success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear history"
      );
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Clear any existing errors
    clearError: (state) => {
      state.error = null;
    },
    // Remove a video from history (for UI interactions)
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(
        (item) => item.video._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History Cases
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.history || [];
        state.error = null;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to History Cases
      .addCase(addToHistory.pending, (state) => {
        // Don't show loading for adding to history (background operation)
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        // Remove existing entry if present (to avoid duplicates)
        state.history = state.history.filter(
          (item) => item.video._id !== action.meta.arg
        );

        // Add new entry at the beginning
        // Note: We'll let the next fetchHistory call get the proper data
        // This is just an optimistic update
        const newEntry = {
          _id: `temp_${Date.now()}`, // temporary ID
          video: { _id: action.meta.arg },
          watchedAt: new Date().toISOString(),
        };
        state.history.unshift(newEntry);
      })
      .addCase(addToHistory.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove single video
      .addCase(removeHistoryItem.fulfilled, (state, action) => {
        state.history = state.history.filter(
          (item) => item.video._id !== action.payload
        );
      })
      .addCase(removeHistoryItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear history
      .addCase(clearHistory.fulfilled, (state) => {
        state.history = [];
      })
      .addCase(clearHistory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, removeFromHistory } = historySlice.actions;
export default historySlice.reducer;
