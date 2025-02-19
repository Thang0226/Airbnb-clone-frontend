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
import AdminHostRequests from './components/admin/AdminHostRequests'



export default function App() {
  const isLoggedIn = JSON.parse(localStorage.getItem('loggedIn'))
  return (
    <Provider store={store}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/owner" element={isLoggedIn ? <HomeOwner /> : <Navigate to={'/'} />} />
            <Route path="/create" element={isLoggedIn ? <CreateHouse /> : <Navigate to={'/'} />} />
            <Route path="/search" element={<MapSample />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to={'/'} />} />
            <Route path="/profile/edit" element={isLoggedIn ? <ProfileUpdateForm /> : <Navigate to={'/'} />} />
            <Route path="/admin" element={isLoggedIn ? <AdminHostRequests /> : <Navigate to={'/'} />} />
          </Routes>
        </Layout>
      </HashRouter>
    </Provider>
  )
}

