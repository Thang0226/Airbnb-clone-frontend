import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../components/auth/axiosConfig';

export const initialState = {
  bookings: null,
  totalPages: 0,
  loading: false,
  error: null,
}

export const getBookings = createAsyncThunk(
  'booking/getBookings',
  async ({username,page, size},thunkAPI) => {
    try {
      const response = await api.get(`/bookings/${username}?page=${page}&size=${size}`)
  
      return {
        bookings: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.loading = false
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default bookingSlice.reducer;