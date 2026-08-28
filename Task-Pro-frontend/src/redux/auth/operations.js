import { createAsyncThunk } from "@reduxjs/toolkit";
import { api, setAuthHeader, clearAuthHeader } from "../../services/api.js";

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

export const register = createAsyncThunk("auth/register", async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/register", credentials);
    setAuthHeader(data.data.accessToken);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Registration failed"));
  }
});

export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    setAuthHeader(data.data.accessToken);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const refreshSession = createAsyncThunk("auth/refreshSession", async (_, thunkAPI) => {
  const { refreshToken } = thunkAPI.getState().auth;

  if (!refreshToken) {
    return thunkAPI.rejectWithValue("No refresh token");
  }

  try {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    setAuthHeader(data.data.accessToken);
    return data.data;
  } catch (error) {
    clearAuthHeader();
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Session expired"));
  }
});

export const refreshUser = createAsyncThunk("auth/refreshUser", async (_, thunkAPI) => {
  const { token } = thunkAPI.getState().auth;

  if (!token) {
    return thunkAPI.rejectWithValue("No access token");
  }

  try {
    setAuthHeader(token);
    const { data } = await api.get("/auth/current");
    return data.data;
  } catch (error) {
    if (error.response?.status !== 401) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to restore session"));
    }

    const result = await thunkAPI.dispatch(refreshSession());
    if (refreshSession.fulfilled.match(result)) {
      return result.payload.user;
    }

    clearAuthHeader();
    return thunkAPI.rejectWithValue(result.payload || "Session expired");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    if (error.response?.status !== 401) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  } finally {
    clearAuthHeader();
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, thunkAPI) => {
  try {
    const { data } = await api.patch("/auth/me", formData);
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Update profile failed"));
  }
});

export const updateTheme = createAsyncThunk("auth/updateTheme", async (theme, thunkAPI) => {
  try {
    const { data } = await api.patch("/auth/theme", { theme });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Update theme failed"));
  }
});

export const requestPasswordReset = createAsyncThunk("auth/requestPasswordReset", async (email, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/request-reset-email", { email });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Unable to send reset email"));
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Unable to reset password"));
  }
});
