import {HashRouter, Routes, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import './scss/custom.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
// import '@coreui/coreui/dist/css/coreui.min.css'
import './App.css'
import HomeOwner from "./components/owner/js/HomeOwner";
import CreateHouse from "./components/owner/js/CreateHouse";
import MapSample from "./components/owner/js/MapSample";
import {ToastContainer} from 'react-toastify'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import UserProfile from "./components/user-profile/UserProfile";
import ProfileUpdateForm from "./components/user-profile/ProfileUpdateForm";


export default function App() {
    return (
        <Provider store={store}>
            <ToastContainer position="top-right" pauseOnFocusLoss={false}/>

            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomeOwner/>}/>
                    <Route path="/create" element={<CreateHouse/>}/>
                    <Route path="/search" element={<MapSample/>}/>
                </Routes>
            </HashRouter>
        </Provider>
    );
}

