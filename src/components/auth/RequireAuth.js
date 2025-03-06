import { Navigate, Outlet } from 'react-router-dom'

const RequireAuth = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Nếu không có token hoặc đã bị logout, chuyển hướng về login
  if (!token) {
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