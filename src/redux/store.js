import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from './slices/accountSlice'
import userProfileReducer from "./slices/userProfileSlice";
import houseReducer from "./slices/houseSlice"; // Import reducer
import userManagementReducer from "./slices/userManagementSlice"; // Import reducer
import userDetailsReducer from "./slices/userDetailsSlice"; // Import reducer
import hostManagementReducer from "./slices/hostManagementSlice";
import bookingReducer from './slices/bookingSlice'
import authReducer from './slices/authSlice'
import chatReducer from './slices/chatSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    houses: houseReducer, // Đăng ký reducer vào store
    account: accountSlice.reducer,
    booking: bookingReducer,
    userProfile: userProfileReducer,
    userManagement: userManagementReducer,
    userDetails: userDetailsReducer,
    hostManagement: hostManagementReducer,
    chat: chatReducer,
  },
})

export default store
