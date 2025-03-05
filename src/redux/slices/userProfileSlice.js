import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig';

export const initialState = {
  userProfile: null,
  loading: false,
  error: null,
}

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (username, thunkAPI) => {
    try {
      const response = await api.get(`/users/profile/${username}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error retrieving profile data!')
    }
  },
)

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateUserProfile',
  async (formData, thunkAPI) => {
    try {
      const response = await api.put(`/users/profile/update`, formData)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error updating profile!')
    }
  },
)

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload
        state.loading = false
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default userProfileSlice.reducer
