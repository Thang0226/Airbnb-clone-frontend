import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from './slices/accountSlice'
import userProfileReducer from "./slices/userProfileSlice";
import houseReducer from "./slices/houseSlice";

const store = configureStore({
  reducer: {
    houses: houseReducer,
    account: accountSlice.reducer,
    userProfile: userProfileReducer,
  },
})

export default store
