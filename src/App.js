import { HashRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import './scss/custom.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'
import HomeOwner from './components/owner/js/HomeOwner'
import CreateHouse from './components/owner/js/CreateHouse'
import MapSample from './components/owner/js/MapSample'
import Register from './components/register/Register'
import Login from './components/login/Login'
import UserProfile from './components/user-profile/UserProfile'
import ProfileUpdateForm from './components/user-profile/ProfileUpdateForm'
import { ToastContainer } from 'react-toastify'
import Layout from './components/Layout'
import Homepage from './components/homepage/Homepage'


export default function App() {

  return (
    <Provider store={store}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/owner" element={<HomeOwner />} />
            <Route path="/create" element={<CreateHouse />} />
            <Route path="/search" element={<MapSample />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile/edit" element={<ProfileUpdateForm />} />
          </Routes>
        </Layout>
      </HashRouter>
    </Provider>
  )
}

