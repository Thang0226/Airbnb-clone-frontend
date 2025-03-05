import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: { chatHost: null },
  reducers: {
    setChatHost(state, action) {
      state.chatHost = action.payload;
    },
    clearChatHost(state) {
      state.chatHost = null;
    },
  },
});

export const { setChatHost, clearChatHost } = chatSlice.actions;
export default chatSlice.reducer;