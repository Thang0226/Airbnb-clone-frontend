import { createSlice } from '@reduxjs/toolkit'

export const usernameSlice = createSlice({
  name: 'username',
  initialState: { username: '' },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload || ''
    },
    resetUsername: (state) => {
      state.username = ''
    },
  },
})

// Export slice actions
export const { setUsername, resetUsername } = usernameSlice.actions