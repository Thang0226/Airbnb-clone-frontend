import {configureStore, createSlice} from "@reduxjs/toolkit";
import {usernameSlice} from "./slices/usernameSlice";

const store = configureStore({
    reducer: {
        username: usernameSlice.reducer
    }
});

export default store;