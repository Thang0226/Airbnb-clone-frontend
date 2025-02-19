import { HashRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import './scss/custom.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
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

