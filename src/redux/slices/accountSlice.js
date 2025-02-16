import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    username: '',
    password: '',
    token: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload || ''
    },
    setPassword: (state, action) => {
      state.password = action.payload || ''
    },
    setToken: (state, action) => {
      state.token = action.payload || ''
    },
    deletePassword: (state, action) => {
      state.password = ''
    },
    resetAccount: (state) => {
      state.token = ''
      state.password = ''
      state.username = ''
    },
  },
})

// Export slice actions
export const { setUsername, setPassword, setToken, deletePassword, resetAccount } = accountSlice.actions