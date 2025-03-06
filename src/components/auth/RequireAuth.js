import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { isTokenExpired } from '../utils/jwtdecode'
import { logout } from '../../redux/slices/accountSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const RequireAuth = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      dispatch(logout()).then(
        toast.info("Working session ended. Please login again")
      )
    }
    setIsChecking(false); // Kết thúc kiểm tra
  }, [dispatch, token]);

  if (isChecking) return null; // Chờ kiểm tra xong mới render

  // Nếu không có token hoặc đã bị logout, chuyển hướng về login
  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không có quyền truy cập, chuyển hướng về trang chủ
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Nếu đủ quyền thì hiển thị route con thông qua Outlet
  return <Outlet />
}

export default RequireAuth;