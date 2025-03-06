import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig'

export const initialState = {
  houseList: [],
  house: {},
  totalPages: 0,
  topFiveHouses: [],
  bookedDates: [],
  latestAvailableDate: null,
  loading: {
    houseList: false,
    topFiveHouses: false,
  },
  error: {
    houseList: null,
    topFiveHouses: null,
  }
}

export const getHouseList = createAsyncThunk(
  'houses/getHouseList',
  async ({ username, page, size }, thunkAPI) => {
    try {
      const response = await api.get(`/houses/host-house-list/${username}?page=${page}&size=${size}`)
      return {
        houseList: response.data.content,
        totalPages: response.data.totalPages,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving House List data!')
    }
  },
)

export const searchHouses = createAsyncThunk(
  'houses/searchHouses',
  async ({ username, houseName, status, page, size }, thunkAPI) => {
    try {
      const response = await api.post(
        `/houses/host-house-list/${username}/search?houseName=${houseName}&status=${status}&page=${page}&size=${size}`,
      )
      return {
        houseList: response.data.content,
        totalPages: response.data.totalPages,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving search data!')
    }
  },
)

export const getBookedDates = createAsyncThunk(
  'houses/getBookedDates',
  async ({ houseId }, thunkAPI) => {
    try {
      const response = await api.get(`/houses/${houseId}/booked-dates`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving Booked Dates data!')
    }
  },
)

export const getLatestAvailableDate = createAsyncThunk(
  'houses/getLatestAvailableDate',
  async ({ houseId, date }, thunkAPI) => {
    try {
      const response = await api.post(`/houses/house-edge-date`, {
        houseId: houseId,
        date: date,
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving Latest Available Date data!')
    }
  },
)

export const updateHouseStatus = createAsyncThunk(
  'houses/updateHouseStatus',
  async ({ houseId, status }, thunkAPI) => {
    try {
      const response = await api.put(`/houses/${houseId}/update-status?status=${status}`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating house status!')
    }
  },
)

export const createMaintenanceRecord = createAsyncThunk(
  'houses/creatMaintenanceRecord',
  async ({ houseId, startDate, endDate }, thunkAPI) => {
    try {
      const response = await api.post(`/houses/create-maintenance-record`,
        { houseId: houseId, startDate: startDate, endDate: endDate })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error creating new Maintenance Record!')
    }
  },
)

export const getMaintenanceRecords = createAsyncThunk(
  'houses/getMaintenanceRecords',
  async ({ houseId }, thunkAPI) => {
    try {
      const response = await api.get(`/houses/${houseId}/maintenance-records`)
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving maintenance records!')
    }
  },
)

export const getTopFiveHouse = createAsyncThunk(
  'houses/getTopFiveHouse',
  async (thunkAPI) => {
    try {
      const response = await api.get(`/houses/top-five-houses`)
      return response.data.content
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving Top five house data!')
    }
  },
)

const houseSlice = createSlice({
  name: 'houses',
  initialState,
  reducers: {
    setHouses: (state, action) => {
      state.list = action.payload
    },
    setHouse: (state, action) => {
      state.house = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách nhà
      .addCase(getHouseList.pending, (state) => {
        state.loading.houseList = true
        state.error.houseList = null
      })
      .addCase(getHouseList.fulfilled, (state, action) => {
        state.houseList = action.payload.houseList
        state.totalPages = action.payload.totalPages
        state.loading.houseList = false
      })
      .addCase(getHouseList.rejected, (state, action) => {
        state.error.houseList = action.payload
        state.loading.houseList = false
      })

      // Tìm kiếm nhà
      .addCase(searchHouses.pending, (state) => {
        state.loading.houseList = true
        state.error.houseList = null
      })
      .addCase(searchHouses.fulfilled, (state, action) => {
        state.houseList = action.payload.houseList;
        state.totalPages = action.payload.totalPages;
        state.loading.houseList = false

      })
      .addCase(searchHouses.rejected, (state, action) => {
        state.error.houseList = action.payload
        state.loading.houseList = false
      })

      // Lấy ngày đã đặt
      .addCase(getBookedDates.fulfilled, (state, action) => {
        state.bookedDates = action.payload;
      })
      .addCase(getBookedDates.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Lấy ngày gần nhất có thể đặt
      .addCase(getLatestAvailableDate.fulfilled, (state, action) => {
        state.latestAvailableDate = action.payload;
      })
      .addCase(getLatestAvailableDate.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Cập nhật trạng thái nhà
      .addCase(updateHouseStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Thêm bản ghi bảo trì
      .addCase(createMaintenanceRecord.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Top Five Houses
      .addCase(getTopFiveHouse.pending, (state) => {
        state.loading.topFiveHouses = true
        state.error.topFiveHouses = null
      })
      .addCase(getTopFiveHouse.fulfilled, (state, action) => {
        state.topFiveHouses = action.payload
        state.loading.topFiveHouses = false
      })
      .addCase(getTopFiveHouse.rejected, (state, action) => {
        state.error.topFiveHouses = action.payload
        state.loading.topFiveHouses = false
      })
  },
})
export const { setHouses, setHouse } = houseSlice.actions
export default houseSlice.reducer
