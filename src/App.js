import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import UserProfile from "./components/user-profile/UserProfile";
import "bootstrap/dist/css/bootstrap.min.css"
import ProfileUpdateForm from "./components/user-profile/ProfileUpdateForm";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/profile" element={<UserProfile username="test123" />}/>
                    <Route path="/profile/edit" element={<ProfileUpdateForm />}/>
                </Routes>
            </BrowserRouter>

        </>
    );
}

export default App;
