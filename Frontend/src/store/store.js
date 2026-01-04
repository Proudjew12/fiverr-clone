import { configureStore } from "@reduxjs/toolkit";
import fiverrReducer from "./fiverr.slice.js";
import userReducer from "./user.slice.js";

export const store = configureStore({
  reducer: {
    fiverr: fiverrReducer,
    user: userReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});
