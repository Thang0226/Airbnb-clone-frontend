import axiosInstance from './axiosConfig';

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/users/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};