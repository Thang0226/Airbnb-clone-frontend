import { configureStore } from "@reduxjs/toolkit";
import houseReducer from "./houseSlice"; // Import reducer

export const store = configureStore({
  reducer: {
    houses: houseReducer, // Đăng ký reducer vào store
  },
});
