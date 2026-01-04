import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fiverrService } from "../services/fiverr.service.remote.js";

// Thunks
export const loadItems = createAsyncThunk(
  "fiverr/loadItems",
  async (filterBy = {}, { rejectWithValue }) => {
    try {
      return await fiverrService.query(filterBy);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to load"
      );
    }
  }
);

export const saveItem = createAsyncThunk(
  "fiverr/saveItem",
  async (item, { rejectWithValue }) => {
    try {
      return await fiverrService.save(item);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to save"
      );
    }
  }
);

export const removeItem = createAsyncThunk(
  "fiverr/removeItem",
  async (itemId, { rejectWithValue }) => {
    try {
      await fiverrService.remove(itemId);
      return itemId;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data || err?.message || "Failed to remove"
      );
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  lastFilter: null, // optional, useful
};

const fiverrSlice = createSlice({
  name: "fiverr",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setLastFilter(state, action) {
      state.lastFilter = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // load
      .addCase(loadItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadItems.fulfilled, (state, action) => {
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
      })
      .addCase(loadItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // save
      .addCase(saveItem.fulfilled, (state, action) => {
        const saved = action.payload;
        if (!saved?._id) return;
        const idx = state.items.findIndex((x) => x._id === saved._id);
        if (idx === -1) state.items.unshift(saved);
        else state.items[idx] = saved;
      })
      .addCase(saveItem.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // remove
      .addCase(removeItem.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((x) => x._id !== id);
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, setLastFilter } = fiverrSlice.actions;
export default fiverrSlice.reducer;

// selectors
export const selectItems = (state) => state.fiverr.items;
export const selectIsLoading = (state) => state.fiverr.isLoading;
export const selectError = (state) => state.fiverr.error;
export const selectLastFilter = (state) => state.fiverr.lastFilter;
