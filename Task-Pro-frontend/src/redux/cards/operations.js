import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

// ─── Add a new card to a column ───
export const addCard = createAsyncThunk(
  "cards/addCard",
  async ({ columnId, title, description, priority, deadline }, thunkAPI) => {
    try {
      const { data } = await api.post("/cards", {
        columnId,
        title,
        description,
        priority,
        deadline,
      });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add card"
      );
    }
  }
);

// ─── Edit a card ───
export const editCard = createAsyncThunk(
  "cards/editCard",
  async ({ cardId, ...updates }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/cards/${cardId}`, updates);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to edit card"
      );
    }
  }
);

// ─── Delete a card ───
export const deleteCard = createAsyncThunk(
  "cards/deleteCard",
  async (cardId, thunkAPI) => {
    try {
      await api.delete(`/cards/${cardId}`);
      return cardId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete card"
      );
    }
  }
);

// ─── Move a card to another column ───
export const moveCard = createAsyncThunk(
  "cards/moveCard",
  async ({ cardId, targetColumnId }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/cards/${cardId}`, {
        columnId: targetColumnId,
      });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to move card"
      );
    }
  }
);
