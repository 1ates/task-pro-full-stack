import { createSlice } from "@reduxjs/toolkit";
import { addCard, editCard, deleteCard, moveCard } from "./operations.js";

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

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    // Bulk-set cards when a board is fetched (called from boardsSlice)
    setCards(state, action) {
      state.items = action.payload;
    },
    // Clear cards on board switch / logout
    clearCards(state) {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── addCard ──
    builder
      .addCase(addCard.pending, handlePending)
      .addCase(addCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addCard.rejected, handleRejected);

    // ── editCard ──
    builder
      .addCase(editCard.pending, handlePending)
      .addCase(editCard.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.items.findIndex(
          (card) => card._id === updated._id
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updated };
        }
      })
      .addCase(editCard.rejected, handleRejected);

    // ── deleteCard ──
    builder
      .addCase(deleteCard.pending, handlePending)
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((card) => card._id !== action.payload);
      })
      .addCase(deleteCard.rejected, handleRejected);

    // ── moveCard ──
    builder
      .addCase(moveCard.pending, handlePending)
      .addCase(moveCard.fulfilled, (state, action) => {
        state.isLoading = false;
        const moved = action.payload;
        const index = state.items.findIndex((card) => card._id === moved._id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...moved };
        }
      })
      .addCase(moveCard.rejected, handleRejected);
  },
});

export const { setCards, clearCards } = cardsSlice.actions;
export default cardsSlice.reducer;
