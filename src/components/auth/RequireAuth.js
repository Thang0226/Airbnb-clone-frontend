// components/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'));
  const userRole = localStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(userRole)) {
    // Nếu không có quyền, có thể chuyển hướng về trang chủ hoặc trang cảnh báo
    return <Navigate to="/" replace />
  }

  // Nếu đủ quyền thì hiển thị route con thông qua Outlet
  return <Outlet />
}

export default RequireAuth;