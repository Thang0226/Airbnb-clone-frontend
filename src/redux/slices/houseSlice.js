import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/axiosConfig'

export const initialState = {
  list: [],
  house: null,
  houseList:[],
  totalPages: 0,
  loading: false,
  error: null,
  bookedDates: [],
  latestAvailableDate: null,
}

export const getHouseList = createAsyncThunk(
  'houses/getHouseList',
  async ({username,page, size},thunkAPI) => {
    try {
      const response = await api.get(`/houses/host-house-list/${username}?page=${page}&size=${size}`)
      return {
        houseList: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving House List data!')
    }
  },
)

export const searchHouses = createAsyncThunk(
  'houses/searchHouses',
  async ({ username, houseName, status, page, size },thunkAPI) => {
    try {
      const response = await api.post(
        `/houses/host-house-list/${username}/search?houseName=${houseName}&status=${status}&page=${page}&size=${size}`
      )
      console.log(response.data.content)
      return {
        houseList: response.data.content,
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving search data!')
    }
  },
)

export const getBookedDates = createAsyncThunk(
  'houses/getBookedDates',
  async ({houseId},thunkAPI) => {
    try {
      const response = await api.get(`/houses/${houseId}/booked-dates`)
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving Booked Dates data!')
    }
  },
)

export const getLatestAvailableDate = createAsyncThunk(
  'houses/getLatestAvailableDate',
  async ({ houseId, date },thunkAPI) => {
    try {
      const response = await api.post(`/houses/house-edge-date`, {
        houseId: houseId,
        date: date,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error retrieving Latest Available Date data!')
    }
  },
)

export const updateHouseStatus = createAsyncThunk(
  'houses/updateHouseStatus',
  async ({ houseId, status },thunkAPI) => {
    try {
      const response = await api.put(`/houses/${houseId}/update-status?status=${status}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error updating house status!')
    }
  },
)

export const creatMaintenanceRecord = createAsyncThunk(
  'houses/creatMaintenanceRecord',
  async ({ houseId, startDate, endDate },thunkAPI) => {
    console.log({houseId: houseId, startDate: startDate, endDate: endDate})
    try {
      const response = await api.post(`/houses/create-maintenance-record`,
        {houseId: houseId, startDate: startDate, endDate: endDate});
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error creating new Maintenance Record!')
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
      .addCase(searchHouses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchHouses.fulfilled, (state, action) => {
        state.houseList = action.payload.houseList;
        state.totalPages = action.payload.totalPages;
        state.loading = false
      })
      .addCase(searchHouses.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(getBookedDates.fulfilled, (state, action) => {
        state.bookedDates = action.payload
      })
      .addCase(getBookedDates.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(getLatestAvailableDate.fulfilled, (state, action) => {
        state.latestAvailableDate = action.payload
      })
      .addCase(getLatestAvailableDate.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateHouseStatus.fulfilled, () => {
      })
      .addCase(updateHouseStatus.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(creatMaintenanceRecord.fulfilled, () => {
      })
      .addCase(creatMaintenanceRecord.rejected, (state, action) => {
        state.error = action.payload
      })
  },
});
export const { setHouses, setHouse  } = houseSlice.actions;
export default houseSlice.reducer;
