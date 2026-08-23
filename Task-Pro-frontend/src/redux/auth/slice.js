import { createSlice } from "@reduxjs/toolkit";
import {
  register,
  login,
  logout,
  refreshUser,
  updateProfile,
  updateTheme,
} from "./operations.js";

const initialState = {
  user: { name: null, email: null, avatarUrl: null, theme: "light" },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        // Not: backend /register endpointi accessToken donmuyor.
        // Bu yuzden RegisterForm icinde register sonrasi ayrica login cagrisi yapiyoruz.
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = initialState.user;
        state.token = null;
        state.isLoggedIn = false;
      })

      // refreshUser (uygulama acilisinda oturumu dogrulama)
      .addCase(refreshUser.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.isLoggedIn = true;
        state.user = action.payload.data;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isRefreshing = false;
        state.isLoggedIn = false;
        state.token = null;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
      })

      // updateTheme
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.user.theme = action.payload.data.theme;
      });
  },
});

export default authSlice.reducer;
