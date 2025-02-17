import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from './slices/accountSlice'
import userProfileReducer from "./slices/userProfileSlice";

const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    userProfile: userProfileReducer,
  },
})

export default store
