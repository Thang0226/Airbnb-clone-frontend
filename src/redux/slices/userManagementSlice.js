import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { BASE_URL } from '../../constants/api'

export const initialState = {
  users: [],
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (page, thunkAPI) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/users?page=${page}&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.content
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
    }
  },
)

export const updateUserStatus = createAsyncThunk(
  'userManagement/updateUserStatus',
  async (userId, thunkAPI) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(`${BASE_URL}/api/admin/update-status/${userId}`,
        null,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving profile data!')
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
        state.users = action.payload
        state.loading = false
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(updateUserStatus.pending, (state) => {
      state.loading = true
      state.error = null
    })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default UserManagementSlice.reducer
