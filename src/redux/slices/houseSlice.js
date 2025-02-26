import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig'

export const initialState = {
  list: [],
  house: null,
  houseList:[],
  totalPages: 0,
  loading: false,
  error: null,
}

export const getHouseList = createAsyncThunk(
  'houses/getHouseList',
  async ({username,page, size},thunkAPI) => {
    try {
      const response = await api.get(`/houses/host-house-list/${username}?page=${page}&size=${size}`)
      console.log(response.data.content)
      return {
        houseList: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

const houseSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    setHouses: (state, action) => {
      state.list = action.payload;
    },
    setHouse: (state, action) => {
      state.house = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHouseList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getHouseList.fulfilled, (state, action) => {
        state.houseList = action.payload.houseList;
        state.totalPages = action.payload.totalPages;
        state.loading = false
      })
      .addCase(getHouseList.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
});
export const { setHouses, setHouse  } = houseSlice.actions;
export default houseSlice.reducer;
