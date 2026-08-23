import { createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthHeader, clearAuthHeader } from "../../services/api.js";

// ─── Register ───
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/register", credentials);
      setAuthHeader(data.data.accessToken);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ─── Login ───
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setAuthHeader(data.data.accessToken);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ─── Logout ───
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await api.post("/auth/logout");
      clearAuthHeader();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// ─── Refresh user ───
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;
    if (!token) return thunkAPI.rejectWithValue("No token");

    try {
      setAuthHeader(token);
      const { data } = await api.get("/auth/current");
      return data.data;
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Refresh failed"
      );
    }
  }
);
