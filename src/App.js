import React from "react";
import HouseList from "./components/HouseList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
      <div>
        <ToastContainer />
        <header>
          <h1>Hệ thống Cho Thuê Nhà</h1>
        </header>
        <main>
          <HouseList />
        </main>
      </div>
  );
}

export default App;
