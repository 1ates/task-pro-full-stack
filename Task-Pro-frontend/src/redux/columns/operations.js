import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

export const addColumn = createAsyncThunk("columns/addColumn", async ({ boardId, title }, thunkAPI) => {
  try {
    const { data } = await api.post(`/boards/${boardId}/columns`, { title, boardId });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to add column"));
  }
});

export const editColumn = createAsyncThunk("columns/editColumn", async ({ columnId, title }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/columns/${columnId}`, { title });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to edit column"));
  }
});

export const deleteColumn = createAsyncThunk("columns/deleteColumn", async (columnId, thunkAPI) => {
  try {
    await api.delete(`/columns/${columnId}`);
    return columnId;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to delete column"));
  }
});
