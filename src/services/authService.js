import axiosInstance from './axiosConfig';
import { toast } from 'react-toastify'

export const logoutAPI = async () => {
  try {
    const response = await axiosInstance.post('/users/logout');
    // console.log(response.data);
    localStorage.clear()
  } catch (error) {
    throw error.response.data;
  }
};

export const loginSetup = async (user, role) => {
  localStorage.setItem('userId', user.id)
  localStorage.setItem('token', user.token)
  localStorage.setItem('loggedIn', JSON.stringify(true))
  localStorage.setItem('username', user.username)
  localStorage.setItem('role', role)
  toast.success('login successful', { hideProgressBar: true })
}

