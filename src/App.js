import {HashRouter, Routes, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from "./redux/store"
import './scss/custom.scss'
import "./App.css"
import HouseList from "./components/HouseList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nabav from "./components/Nabav"
import SearchBarForHouseAvailable from "./components/SearchBarForHouseAvailable";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<div>
                          <Nabav/>
                          <SearchBarForHouseAvailable/>
                          <HouseList />
                          </div>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </HashRouter>
        </Provider>
    );

export default App;
