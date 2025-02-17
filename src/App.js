import { HashRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import './scss/custom.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'

import { ToastContainer } from 'react-toastify'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import UserProfile from "./components/user-profile/UserProfile";
import ProfileUpdateForm from "./components/user-profile/ProfileUpdateForm";

export default function App() {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" pauseOnFocusLoss={false} />
      <HashRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<UserProfile />}/>
          <Route path="/profile/edit" element={<ProfileUpdateForm />}/>
        </Routes>
      </HashRouter>
    </Provider>
  )
}