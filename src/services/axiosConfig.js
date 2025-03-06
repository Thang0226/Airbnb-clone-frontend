import axios from 'axios'
import { BASE_URL_API } from '../constants/api'
import { isTokenExpired } from '../components/utils/jwtdecode'
import { logout } from '../redux/slices/accountSlice'
import store from '../redux/store'
import { toast } from 'react-toastify'

const instance = axios.create({
  baseURL: BASE_URL_API,
})

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      if (isTokenExpired(token)) {
        await store.dispatch(logout())
        toast.info('Working session ended. Please login again!')
        return Promise.reject(new Error('Token expired'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default instance