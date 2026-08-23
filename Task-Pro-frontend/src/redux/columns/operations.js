import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

// ─── Add a new column to a board ───
export const addColumn = createAsyncThunk(
  "columns/addColumn",
  async ({ boardId, title }, thunkAPI) => {
    try {
      const { data } = await api.post("/columns", { boardId, title });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add column"
      );
    }
  }
);

// ─── Edit a column title ───
export const editColumn = createAsyncThunk(
  "columns/editColumn",
  async ({ columnId, title }, thunkAPI) => {
    try {
      const { data } = await api.patch(`/columns/${columnId}`, { title });
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to edit column"
      );
    }
  }
);

// ─── Delete a column ───
export const deleteColumn = createAsyncThunk(
  "columns/deleteColumn",
  async (columnId, thunkAPI) => {
    try {
      await api.delete(`/columns/${columnId}`);
      return columnId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete column"
      );
    }
  }
);
