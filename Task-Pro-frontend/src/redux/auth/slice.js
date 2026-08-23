import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: { name: null, email: null },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Placeholder reducers — will be extended with auth operations
    clearAuth() {
      return initialState;
    },
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
