import {HashRouter, Routes, Route} from 'react-router-dom';
import './scss/custom.scss'
import "./App.css"
import HouseList from "./components/HouseList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nabav from "./components/Nabav"
import SearchBarForHouseAvailable from "./components/SearchBarForHouseAvailable";

import Register from "./components/Register/Register";

function App() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<div>
                          <Nabav/>
                          <SearchBarForHouseAvailable/>
                          <HouseList />
                          </div>}/>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </HashRouter>
        </div>
    );

export default App;
