import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig';

export const initialState = {
  bookings: null,
  booking: null,
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
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving bookings data!')
    }
  },
)

export const searchBookings = createAsyncThunk(
  'booking/searchBookings',
  async ({username, searchData, page, size},thunkAPI) => {
    try {
      const response = await api.post(`/bookings/${username}/search?page=${page}&size=${size}`, searchData)
      return {
        bookings: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error searching for booking data!')
    }
  },
)

export const processBooking = createAsyncThunk(
  'booking/processBooking',
  async ({bookingID, action},thunkAPI) => {
    try {
      const response = await api.put(`/bookings/${bookingID}/process-booking?action=${action}`)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error processing booking!')
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
      .addCase(searchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.loading = false
      })
      .addCase(searchBookings.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(processBooking.fulfilled, (state, action) => {
        state.booking = action.payload;
      })
      .addCase(processBooking.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default bookingSlice.reducer;