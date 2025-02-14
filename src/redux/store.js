import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./slices/userProfileSlice"; // Import reducer từ slice bạn đã tạo

const store = configureStore({
    reducer: {
        userProfile: userProfileReducer, // Định nghĩa reducer trong store
    },
});

export default store;
