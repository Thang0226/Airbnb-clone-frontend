import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig';

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
    try {
      const response = await api.get(`/admin/users/${userId}`)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error|| 'Error retrieving profile data!')
    }
  },
)

export const getUserRentalHistory = createAsyncThunk(
  'userDetails/getUserRentalHistory',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/admin/user-rental-history/${userId}`)
      console.log(response.data.content)
      return response.data.content;
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error retrieving profile data!')
    }
  },
)

export const getUserTotalPayment = createAsyncThunk(
  'userDetails/getUserTotalPayment',
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/admin/user-payment/${userId}`)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error|| 'Error retrieving profile data!')
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
      .addCase(getUserTotalPayment.fulfilled, (state, action) => {
        state.userTotalPayment = action.payload
      })
      .addCase(getUserTotalPayment.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default userDetailsSlice.reducer;