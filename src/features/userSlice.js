import { createSlice } from "@reduxjs/toolkit";
const userFromLocalStorage = JSON.parse(localStorage.getItem("user"));
const initialState = {
  user: userFromLocalStorage || null,
  authReady: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem("user", JSON.stringify(payload));
    },
    isAuthReady: (state) => {
      state.authReady = true;
    },
    clear: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { login, isAuthReady, clear } = userSlice.actions;
export default userSlice.reducer;
