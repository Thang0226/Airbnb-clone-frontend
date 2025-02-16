import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./slices/userProfileSlice";

const store = configureStore({
    reducer: {
        userProfile: userProfileReducer,
    },
});

export default store;
