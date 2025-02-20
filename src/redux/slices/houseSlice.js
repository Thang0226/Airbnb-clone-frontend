// npm install @reduxjs/toolkit react-redux


import { createSlice } from "@reduxjs/toolkit";

const houseSlice = createSlice({
  name: "houses",
  initialState: {
    list: []
  },
  reducers: {
    setHouses: (state, action) => {
      state.list = action.payload;
    },
  },
});
export const { setHouses } = houseSlice.actions;
export default houseSlice.reducer;
