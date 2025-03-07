import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    username: localStorage.getItem('username') || '',
    userId: localStorage.getItem('userId') || '',
    password: '',
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || ''
  },
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload || ''
    },
    setUserId: (state, action) => {
      state.userId = action.payload || ''
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
      state.userId = ''
    },
    logout: (state) => {
      state.token = ''
      state.password = ''
      state.username = ''
      state.role = ''
      state.userId = ''
      localStorage.clear()
    }
  },
})

// Export slice actions
export const { setUsername, setUserId, setPassword, setToken, setRole, deleteToken, deletePassword, resetAccount, logout } = accountSlice.actions