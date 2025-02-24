import { createSlice } from "@reduxjs/toolkit";

const houseSlice = createSlice({
  name: "houses",
  initialState: {
    list: [],
    house: null
  },
  reducers: {
    setHouses: (state, action) => {
      state.list = action.payload;
    },
    setHouse: (state, action) => {
      state.house = action.payload;
    }
  },
});
export const { setHouses, setHouse  } = houseSlice.actions;
export default houseSlice.reducer;
