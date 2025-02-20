import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from './slices/accountSlice'
import userProfileReducer from "./slices/userProfileSlice";
import houseReducer from "./slices/houseSlice";
import userManagementReducer from "./slices/userManagementSlice"; // Import reducer

const store = configureStore({
  reducer: {
    houses: houseReducer,
    account: accountSlice.reducer,
    userProfile: userProfileReducer,
    userManagement: userManagementReducer,
  },
})

export default store
