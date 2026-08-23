import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  activeBoard: null,
  isLoading: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard(state, action) {
      state.activeBoard = action.payload;
    },
    updateBoardBackground(state, action) {
      if (state.activeBoard) {
        state.activeBoard.background = action.payload;
      }
      const boardIndex = state.items.findIndex(
        (b) => b._id === state.activeBoard?._id
      );
      if (boardIndex !== -1) {
        state.items[boardIndex].background = action.payload;
      }
    },
    clearBoards(state) {
      state.items = [];
      state.activeBoard = null;
      state.error = null;
    },
  },
});

export const { setActiveBoard, updateBoardBackground, clearBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
