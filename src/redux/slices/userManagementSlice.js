import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig'

export const initialState = {
  users: [],
  totalPages: 1,
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async ({ page, size }, thunkAPI) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&size=${size}`)
      return {
        users: response.data.content,
        totalPages: response.data.totalPages,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error retrieving profile data!')
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  'userManagement/updateUserStatus',
  async (userId, thunkAPI) => {
    try {
      const response = await api.post(`/admin/update-status/${userId}`,
        null)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error retrieving profile data!')
    }
  },
)

const UserManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users
        state.totalPages = action.payload.totalPages
        state.loading = false
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default UserManagementSlice.reducer
