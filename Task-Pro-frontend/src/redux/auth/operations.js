import { createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthHeader, clearAuthHeader } from "../../services/api.js";

// axios withCredentials: backend httpOnly cookie (refreshToken, sessionId) kullaniyor
api.defaults.withCredentials = true;

export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/auth/logout");
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Logout failed",
    );
  }
});

// Sayfa yenilendiginde / uygulama acilisinda kullaniciyi dogrulamak icin
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (!persistedToken) {
      return thunkAPI.rejectWithValue("No token found");
    }

    try {
      setAuthHeader(persistedToken);
      const { data } = await api.get("/auth/current");
      return data;
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Session expired",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, thunkAPI) => {
    try {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      const { data } = await api.patch("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

export const updateTheme = createAsyncThunk(
  "auth/updateTheme",
  async (theme, thunkAPI) => {
    try {
      const { data } = await api.patch("/auth/theme", { theme });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Theme update failed",
      );
    }
  },
);
