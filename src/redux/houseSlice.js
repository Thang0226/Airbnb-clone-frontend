// npm install @reduxjs/toolkit react-redux


import { createSlice } from "@reduxjs/toolkit";

const houseSlice = createSlice({
  name: "houses",
  initialState: [],
  reducers: {
    setHouses: (state, action) => {
      console.log("Đã nhận được dữ liệu từ dispatch trong reducer:", action.payload);
      return action.payload; // Cập nhật danh sách nhà từ API
    },
  },
});
export const { setHouses } = houseSlice.actions;
export default houseSlice.reducer;
