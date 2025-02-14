import React, { useState } from "react"
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Đảm bảo bạn đã có store.js
import HouseList from "./components/HouseList";
import SearchBarForHouseAvailable from "./components/SearchBarForHouseAvailable";
import HouseListBeforeSearch from "./components/HouseListBeforeSearch"
import Nabav from "./components/Nabav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {


  const [searchPerformed, setSearchPerformed] = useState(false);
  const handleSearch = (searchData) => {
    setSearchPerformed(true);
  };

  return (
    <div>
      <Nabav />

      {/* Bọc redux: tìm kiếm và danh sách */}
      <Provider store={store}>
        <SearchBarForHouseAvailable onSearch={handleSearch} />
        {/* Hiển thị HouseList nếu đã tìm kiếm, ngược lại hiển thị HouseListBeforeSearch */}
        {searchPerformed ? <HouseList /> : <HouseListBeforeSearch />}


      </Provider>

      {/* Toast thông báo */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
