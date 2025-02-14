import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../../constants/api";

export const initialState = {
    userProfile: null,
    loading: false,
    error: null,
};

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetchUserProfile",
    async (username, {rejectWithValue}) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users/profile/${username}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error retrieving profile data!");
        }
    }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (formData, {rejectWithValue}) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/users/profile/update`, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error updating profile!");
        }
    }
);

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.userProfile = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.userProfile = action.payload;
                state.loading = false;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export default userProfileSlice.reducer;
