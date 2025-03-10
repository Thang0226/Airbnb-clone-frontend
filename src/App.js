import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import './style/scss/custom.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './App.css'
import HostLayout from './components/host/js/HostLayout'
import CreateHouse from './components/host/js/CreateHouse'
import MapSample from './components/host/js/MapSample'
import Register from './components/register/Register'
import Login from './components/login/Login'
import UserProfile from './components/user/user-profile/UserProfile'
import ProfileUpdateForm from './components/user/user-profile/ProfileUpdateForm'
import Layout from './components/Layout'
import Homepage from './components/homepage/Homepage'
import HostList from './components/admin/HostList'
import RequireAuth from './components/auth/RequireAuth'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import { UserList } from './components/admin/UserList'
import ChangePassword from './components/user/user-change-password/ChangePassword'
import UserDetails from './components/admin/UserDetails'
import House from './components/house/House'
import UpdateHouse from './components/host/js/UpdateHouse'
import HostDetails from './components/admin/host-profile/HostDetail'
import HostMainPage from './components/host/js/HostMainPage'
import BookingList from './components/host/js/BookingList'
import { ROLE_ADMIN, ROLE_HOST, ROLE_USER } from './constants/roles'
import UserBookingList from './components/user/bookings/UserBookingList'
import HostHouseDetails from './components/host/js/HostHouseDetails'
import HouseListTable from './components/host/js/HouseListTable'
import HostEarnings from './components/host/js/HostEarnings'
import Messenger from './components/chat/Messenger'
import ScrollToTop from './components/utils/ScrollToTop'
import AuthVerify from './components/auth/AuthVerify'
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated'

export default function App() {

  return (
    <Provider store={store}>
      <HashRouter>
        <ScrollToTop />
        <AuthVerify>
        <Routes>
          {/* Route cho User */}
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/search" element={<MapSample />} />

            <Route element={<RedirectIfAuthenticated />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE_USER]} />}>
              <Route path="/user/bookings" element={<UserBookingList />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE_USER, ROLE_HOST]} />}>
              <Route path="/houses/:id" element={<House/>} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLE_USER, ROLE_ADMIN, ROLE_HOST]} />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<ProfileUpdateForm />} />
              <Route path="/user/change-password" element={<ChangePassword />} />
            </Route>
          </Route>

          {/* Route cho Admin */}
          <Route element={<RequireAuth allowedRoles={[ROLE_ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/host/request" element={<HostList />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:userID" element={<UserDetails />} />
              <Route path="/admin/hosts" element={<HostList />} />
              <Route path="/admin/host/:id" element={<HostDetails />} />
              <Route path="/admin/hosts/:id/houses" element={<HouseListTable />} />
              <Route path="/admin/profile" element={<UserProfile />} />
              <Route path="/admin/profile/edit" element={<ProfileUpdateForm />} />
            </Route>
          </Route>

          {/* Route cho Host */}
          <Route element={<RequireAuth allowedRoles={[ROLE_HOST]} />}>
            <Route element={<HostLayout />}>
              <Route path="/host" element={<HostMainPage />} />
              <Route path="/host/create" element={<CreateHouse />} />
              <Route path="/host/update/:houseId" element={<UpdateHouse />} />
              <Route path="/host/house/:houseId" element={<HostHouseDetails />} />
              <Route path="/host/houses" element={<HouseListTable />} />
              <Route path="/host/bookings" element={<BookingList />} />
              <Route path="/host/earnings" element={<HostEarnings />} />
              <Route path="/host/profile" element={<UserProfile />} />
              <Route path="/host/profile/edit" element={<ProfileUpdateForm />} />
              <Route path="/host/messenger" element={<Messenger/>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthVerify>
      </HashRouter>
    </Provider>
  )
}