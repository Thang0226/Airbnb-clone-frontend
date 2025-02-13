import {HashRouter, Routes, Route} from 'react-router-dom';
import './scss/custom.scss'
import "./App.css"

import Register from "./components/Register/Register";

function App() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route path="/register" element={<Register/>}/>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;
