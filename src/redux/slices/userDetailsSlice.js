import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { BASE_URL } from '../../constants/api'

export const initialState = {
  userDetails: null,
  userRentalHistory: null,
  userTotalPayment: 0,
  loading: false,
  error: null,
}

export const getUserDetails = createAsyncThunk(
  'userDetails/getUserDetails',
  async (userId, thunkAPI) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/user-details/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

export const getUserRentalHistory = createAsyncThunk(
  'userDetails/getUserRentalHistory',
  async (userId, thunkAPI) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/user-rental-history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data.content)
      return response.data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

export const getUserTotalPayment = createAsyncThunk(
  'userDetails/getUserTotalPayment',
  async (userId, thunkAPI) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/user-payment/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload
        state.loading = false
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(getUserRentalHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserRentalHistory.fulfilled, (state, action) => {
        state.userRentalHistory = action.payload
        state.loading = false
      })
      .addCase(getUserRentalHistory.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(getUserTotalPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserTotalPayment.fulfilled, (state, action) => {
        state.userTotalPayment = action.payload
        state.loading = false
      })
      .addCase(getUserTotalPayment.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default userDetailsSlice.reducer;