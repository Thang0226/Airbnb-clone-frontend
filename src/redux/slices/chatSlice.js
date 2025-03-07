import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatHost: null,
    currentUser: {
      id: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
    },
  },
  reducers: {
    setChatHost(state, action) {
      state.chatHost = action.payload;
    },
    clearChatHost(state) {
      state.chatHost = null;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const { setChatHost, clearChatHost, setCurrentUser } = chatSlice.actions;
export default chatSlice.reducer;