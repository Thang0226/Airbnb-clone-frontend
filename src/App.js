import {Link, HashRouter, Routes, Route} from 'react-router-dom';
import './scss/custom.scss'

import Register from "./components/Register";

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
