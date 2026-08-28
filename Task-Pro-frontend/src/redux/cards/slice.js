import { createSlice } from "@reduxjs/toolkit";
import { addCard, editCard, deleteCard, moveCard } from "./operations.js";
import { deleteColumn } from "../columns/operations.js";

const initialState = {
  items: [],
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

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCards(state, action) {
      state.items = action.payload;
    },
    clearCards(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCard.pending, handlePending)
      .addCase(addCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(addCard.rejected, handleRejected);
    builder
      .addCase(editCard.pending, handlePending)
      .addCase(editCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const index = state.items.findIndex((card) => card._id === action.payload._id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      })
      .addCase(editCard.rejected, handleRejected);
    builder
      .addCase(deleteCard.pending, handlePending)
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = state.items.filter((card) => card._id !== action.payload);
      })
      .addCase(deleteCard.rejected, handleRejected);
    builder
      .addCase(moveCard.pending, handlePending)
      .addCase(moveCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const index = state.items.findIndex((card) => card._id === action.payload._id);
        if (index !== -1) state.items[index] = { ...state.items[index], ...action.payload };
      })
      .addCase(moveCard.rejected, handleRejected);
    builder
      .addCase(deleteColumn.pending, handlePending)
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = state.items.filter((card) => card.columnId !== action.payload);
      })
      .addCase(deleteColumn.rejected, handleRejected);
  },
});

export const { setCards, clearCards } = cardsSlice.actions;
export default cardsSlice.reducer;
