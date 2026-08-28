import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout,
  refreshSession,
  refreshUser,
  register,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  updateTheme,
} from "./operations.js";

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const setAuthenticatedUser = (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.accessToken;
  state.refreshToken = action.payload.refreshToken;
  state.isLoggedIn = true;
  state.isRefreshing = false;
  state.isLoading = false;
  state.error = null;
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: () => ({ ...initialState, isRefreshing: false }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, setAuthenticatedUser)
      .addCase(register.rejected, handleRejected)
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, setAuthenticatedUser)
      .addCase(login.rejected, handleRejected)
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshSession.fulfilled, setAuthenticatedUser)
      .addCase(refreshSession.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.isRefreshing = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, () => ({ ...initialState, isRefreshing: false }))
      .addCase(logout.rejected, handleRejected)
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateProfile.rejected, handleRejected)
      .addCase(updateTheme.pending, handlePending)
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateTheme.rejected, handleRejected)
      .addCase(requestPasswordReset.pending, handlePending)
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordReset.rejected, handleRejected)
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, handleRejected);
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
