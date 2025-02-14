import {HashRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from "./redux/store"
import './scss/custom.scss'
import "./App.css"
import "react-toastify/dist/ReactToastify.css";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

export default function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </HashRouter>
        </Provider>
    );
}