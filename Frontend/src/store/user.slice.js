import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { _id, fullname, isAdmin, ... }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload || null;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectLoggedinUser = (state) => state.user.user;

export default userSlice.reducer;
