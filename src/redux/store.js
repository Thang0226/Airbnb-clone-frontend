import { configureStore } from "@reduxjs/toolkit";
import userProfileSlice from "./slices/userProfileSlice"; // Import reducer từ slice bạn đã tạo

const store = configureStore({
    reducer: {
        userProfile: userProfileSlice, // Định nghĩa reducer trong store
    },
});

export default store;
