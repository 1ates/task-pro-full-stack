import { createSlice } from "@reduxjs/toolkit";
import { addBoard, editBoard, deleteBoard, fetchBoardById, fetchBoards } from "./operations.js";

const initialState = {
  items: [],
  current: null,
  isLoading: false,
  isLoadingCurrent: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.isLoadingCurrent = false;
  state.error = action.payload;
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    clearCurrentBoard(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, handlePending)
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchBoards.rejected, handleRejected)

      .addCase(fetchBoardById.pending, (state) => {
        state.isLoadingCurrent = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.isLoadingCurrent = false;
        state.error = null;
        state.current = action.payload;
      })
      .addCase(fetchBoardById.rejected, handleRejected)
      .addCase(addBoard.pending, handlePending)
      .addCase(addBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(addBoard.rejected, handleRejected)
      .addCase(editBoard.pending, handlePending)
      .addCase(editBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const index = state.items.findIndex((board) => board._id === action.payload._id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
        if (state.current?._id === action.payload._id) {
          state.current = { ...state.current, ...action.payload };
        }
      })
      .addCase(editBoard.rejected, handleRejected)
      .addCase(deleteBoard.pending, handlePending)
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = state.items.filter((board) => board._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      })
      .addCase(deleteBoard.rejected, handleRejected);
  },
});

export const { clearCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
