import React from "react";
import HouseList from "./components/HouseList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nabav from "./components/Nabav"
import SearchBarForHouseAvailable from "./components/SearchBarForHouseAvailable";
function App() {
  return (
      <div>

        <Nabav>

        </Nabav>

        <SearchBarForHouseAvailable>

        </SearchBarForHouseAvailable>
        <ToastContainer />
        <header>
          <h1></h1>
        </header>
        <main>
          <HouseList />
        </main>
      </div>
  );
}

export default App;
