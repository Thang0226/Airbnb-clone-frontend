import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token) => {
  if (!token) return true; // Nếu không có token, coi như hết hạn

  try {
    const { exp } = jwtDecode(token); // Lấy thời gian hết hạn (exp)
    if (!exp) return true;

    const now = Date.now() / 1000; // Thời gian hiện tại tính bằng giây
    return exp < now; // Trả về true nếu token đã hết hạn
  } catch (error) {
    return true; // Nếu decode lỗi, coi như hết hạn
  }
};
