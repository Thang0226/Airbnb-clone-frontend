import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import './scss/custom.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import HomeOwner from './components/owner/js/HomeOwner'
import CreateHouse from './components/owner/js/CreateHouse'
import MapSample from './components/owner/js/MapSample'
import Register from './components/register/Register'
import Login from './components/login/Login'
import UserProfile from './components/user-profile/UserProfile'
import ProfileUpdateForm from './components/user-profile/ProfileUpdateForm'
import Layout from './components/Layout'
import Homepage from './components/homepage/Homepage'
import HostRequests from './components/admin/HostRequests'
import RequireAuth from './components/auth/RequireAuth'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import { UserList } from './components/admin/UserList'
import ChangePassword from './components/user-change-password/ChangePassword'
import UserDetails from './components/admin/UserDetails'

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          {/* Các route dùng layout cho user */}
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<MapSample />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
              <Route path="/owner" element={<HomeOwner />} />
              <Route path="/create" element={<CreateHouse />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<ProfileUpdateForm />} />
              <Route path="/user/change-password" element={<ChangePassword/>} />
            </Route>
          </Route>

          {/* Các route dành riêng cho admin */}
          <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/host/request" element={<HostRequests />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:userID" element={<UserDetails />} />
              <Route path="/admin/profile" element={<UserProfile />} />
              <Route path="/admin/profile/edit" element={<ProfileUpdateForm />} />
              {/* Các route admin khác có thể thêm tại đây */}
            </Route>
          </Route>

          {/* Route không khớp sẽ chuyển hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </Provider>
  )
}