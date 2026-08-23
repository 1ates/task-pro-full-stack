import { createSlice } from "@reduxjs/toolkit";
import { addColumn, editColumn, deleteColumn } from "./operations.js";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// ─── Helper: pending / rejected handlers ───
const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    // Bulk-set columns when a board is fetched (called from boardsSlice)
    setColumns(state, action) {
      state.items = action.payload;
    },
    // Clear columns on board switch / logout
    clearColumns(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── addColumn ──
    builder
      .addCase(addColumn.pending, handlePending)
      .addCase(addColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addColumn.rejected, handleRejected);

    // ── editColumn ──
    builder
      .addCase(editColumn.pending, handlePending)
      .addCase(editColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.items.findIndex((col) => col._id === updated._id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updated };
        }
      })
      .addCase(editColumn.rejected, handleRejected);

    // ── deleteColumn ──
    builder
      .addCase(deleteColumn.pending, handlePending)
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((col) => col._id !== action.payload);
      })
      .addCase(deleteColumn.rejected, handleRejected);
  },
});

export const { setColumns, clearColumns } = columnsSlice.actions;
export default columnsSlice.reducer;
