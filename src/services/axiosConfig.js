import axios from 'axios';
import { BASE_URL_API } from '../constants/api'
import { logout } from '../redux/slices/accountSlice'
import { isTokenExpired } from '../components/utils/jwtdecode'
import store from '../redux/store'
import { toast } from 'react-toastify'

const instance = axios.create({
  baseURL: BASE_URL_API,
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        store.dispatch(logout())
        toast.info("Working session ended. Please login again")
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;