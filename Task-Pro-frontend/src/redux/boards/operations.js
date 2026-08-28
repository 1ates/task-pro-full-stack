import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api.js";

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

export const fetchBoards = createAsyncThunk("boards/fetchAll", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/boards");
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch boards"));
  }
});

export const fetchBoardById = createAsyncThunk("boards/fetchById", async (boardId, thunkAPI) => {
  try {
    const { data } = await api.get(`/boards/${boardId}`);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch board"));
  }
});

export const addBoard = createAsyncThunk("boards/add", async (payload, thunkAPI) => {
  try {
    const { data } = await api.post("/boards", payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to add board"));
  }
});

export const editBoard = createAsyncThunk("boards/edit", async ({ boardId, ...payload }, thunkAPI) => {
  try {
    const { data } = await api.patch(`/boards/${boardId}`, payload);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to edit board"));
  }
});

export const deleteBoard = createAsyncThunk("boards/delete", async (boardId, thunkAPI) => {
  try {
    await api.delete(`/boards/${boardId}`);
    return boardId;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to delete board"));
  }
});
