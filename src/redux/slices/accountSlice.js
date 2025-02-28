import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    username: localStorage.getItem('username') || '',
    password: '',
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || ''
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
    setRole: (state, action) => {
      state.role = action.payload || ''
    },
    deletePassword: (state) => {
      state.password = ''
    },
    deleteToken: (state) => {
      state.token = ''
    },
    resetAccount: (state) => {
      state.token = ''
      state.password = ''
      state.username = ''
      state.role = ''
    },
  },
})

// Export slice actions
export const { setUsername, setPassword, setToken, setRole, deleteToken, deletePassword, resetAccount } = accountSlice.actions