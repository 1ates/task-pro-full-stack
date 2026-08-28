import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

export const addCard = createAsyncThunk("cards/add", async ({ columnId, ...payload }, thunkAPI) => {
  try {
    const { data } = await api.post(`/columns/${columnId}/cards`, payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to add card"));
  }
});

export const editCard = createAsyncThunk("cards/edit", async ({ cardId, ...updates }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/cards/${cardId}`, updates);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to edit card"));
  }
});

export const deleteCard = createAsyncThunk("cards/delete", async (cardId, thunkAPI) => {
  try {
    await api.delete(`/cards/${cardId}`);
    return cardId;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to delete card"));
  }
});

export const moveCard = createAsyncThunk("cards/move", async ({ cardId, targetColumnId }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/cards/${cardId}/move`, { columnId: targetColumnId });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to move card"));
  }
});
