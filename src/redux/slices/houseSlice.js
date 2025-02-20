import { createSlice, createAsyncThunk  } from "@reduxjs/toolkit";
import axios from 'axios';

// Handle API CreateHouse
export const createHouse = createAsyncThunk(
  'house/create',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().account.token; // Extracts token from Redux account state
      const response = await axios.post(
        'http://localhost:8080/api/houses/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  formData: {
    houseName: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    price: '',
    description: '',
  },
  selectedFiles: [],
  previews: [],
  mapData: {
    name: '',
    address: '',
  },
  selectedAddressData: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  validated: false,
};

const houseSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    // For Searching
    setHouses: (state, action) => {
      console.log("Đã nhận được dữ liệu từ dispatch trong reducer:", action.payload);
      return action.payload; // Cập nhật danh sách nhà từ API
    },
    // Update form fields
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    // Preview image
    setSelectedFiles: (state, action) => {
      state.selectedFiles = action.payload;
    },
    setPreviews: (state, action) => {
      state.previews = action.payload;
    },
    // Remove image
    removeImage: (state, action) => {
      const index = action.payload;
      state.selectedFiles = state.selectedFiles.filter((_, i) => i !== index);
      state.previews = state.previews.filter((_, i) => i !== index);
    },

    // Update address
    setMapData: (state, action) => {
      state.mapData = action.payload;
    },
    setSelectedAddressData: (state, action) => {
      state.selectedAddressData = action.payload;
    },
    // Validate form
    setValidated: (state, action) => {
      state.validated = action.payload;
    },
    // Reset form
    resetForm: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHouse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createHouse.fulfilled, (state) => {
        state.status = 'succeeded';
        // Reset form after successful submission
        return initialState;
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});
export const {
  setHouses,
  updateFormField,
  setSelectedFiles,
  setPreviews,
  removeImage,
  setMapData,
  setSelectedAddressData,
  setValidated,
  resetForm,
} = houseSlice.actions;
export default houseSlice.reducer;
