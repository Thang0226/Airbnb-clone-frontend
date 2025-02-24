import axios from 'axios';
import { BASE_URL_API } from '../../constants/api'

const instance = axios.create({
  baseURL: BASE_URL_API,
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default instance;