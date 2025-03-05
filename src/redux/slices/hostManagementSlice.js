import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig';


export const initialState = {
  hosts: null,
  hostDetails: null,
  totalPages: 1,
  loading: false,
  error: null,
}

export const fetchHosts = createAsyncThunk(
  'hostManagement/fetchHosts',
  async ({ page, size }, thunkAPI) => {
    try {
      const response = await api.get(`/admin/hosts?page=${page}&size=${size}`)
      return {
        hosts: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error || 'Error retrieving profile data!')
    }
  },
)

const HostManagementSlice = createSlice({
  name: 'hostManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHosts.fulfilled, (state, action) => {
        state.hosts = action.payload.hosts;
        state.totalPages = action.payload.totalPages;
        state.loading = false
      })
      .addCase(fetchHosts.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default HostManagementSlice.reducer;