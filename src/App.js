import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { HashRouter , Route , Routes } from "react-router-dom";
import HomeOwner from "./components/owner/js/HomeOwner";
import CreateHouse from "./components/owner/js/CreateHouse";


function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomeOwner/>}/>
                <Route path="/create" element={<CreateHouse/>}/>
            </Routes>
        </HashRouter>
    );
}

export default App;
