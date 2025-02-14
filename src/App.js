import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { HashRouter , Route , Routes } from "react-router-dom";
import HomeOwner from "./components/owner/js/HomeOwner";
import CreateHouse from "./components/owner/js/CreateHouse";
import MapSample from "./components/owner/js/MapSample";


function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomeOwner/>}/>
                <Route path="/create" element={<CreateHouse/>}/>
                <Route path="/search" element={<MapSample />}/>
            </Routes>
        </HashRouter>
    );
}

export default App;
