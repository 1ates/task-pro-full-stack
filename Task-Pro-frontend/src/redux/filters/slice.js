import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  priority: "all", // 'all' | 'without' | 'low' | 'medium' | 'high'
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilterPriority(state, action) {
      state.priority = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const { setFilterPriority, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
