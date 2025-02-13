import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./css/HouseList.css";
import {
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
} from '@coreui/react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Khắc phục lỗi icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component để di chuyển view của bản đồ
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};


const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('2024-02-20'); // có thể gán mặc định từ dữ liệu mẫu
  const [checkOut, setCheckOut] = useState('2024-03-10'); // có thể gán mặc định từ dữ liệu mẫu
  const [guests, setGuests] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' hoặc 'desc'
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [houses, setHouses] = useState([]);
  const [mapCenter, setMapCenter] = useState([16.047079, 108.206230]); // Vị trí mặc định (Đà Nẵng)
  const [zoom, setZoom] = useState(5);


  // Dữ liệu mẫu các căn nhà <
  const sampleHouses = [
    {
      id: 1,
      city: "Ho Chi Minh City",
      latitude: 10.77690000,
      longitude: 106.70090000,
      name: "Mini condominium in District 1",
      price: "600.000đ/ngày"
    },
    {
      id: 2,
      city: "Lao Cai",
      latitude: 22.33640000,
      longitude: 103.84300000,
      name: "Mountain view guesthouse in Sapa",
      price: "700.000đ/ngày"
    }
  ];

  // Danh sách các thành phố chính
  const cities = [
    { name: "Ho Chi Minh City", lat: 10.7769, lng: 106.7009 },
    { name: "Hanoi", lat: 21.0285, lng: 105.8542 },
    { name: "Da Nang", lat: 16.0544, lng: 108.2022 },
    { name: "Lao Cai", lat: 22.3364, lng: 103.8430 },
    { name: "Nha Trang", lat: 12.2388, lng: 109.1967 },
    { name: "Can Tho", lat: 10.0452, lng: 105.7469 }
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setLocation(city.name);
    setMapCenter([city.lat, city.lng]);
    setZoom(12);

    // Lọc các căn nhà theo thành phố được chọn
    const filteredHouses = sampleHouses.filter(house =>
      house.city === city.name
    );
    setHouses(filteredHouses);
  };

  // Khi nhấn nút "Tìm kiếm", gọi callback onSearch và truyền các tham số tìm kiếm
  // Khi nhấn nút "Tìm kiếm", gọi callback onSearch và truyền các tham số tìm kiếm
  const handleSearchButtonClick = () => {
    const searchData = {

    }; location,
      checkIn,
      checkOut,
      guests,
      sortOrder,
      minBedrooms,
      minBathrooms,

    console.log("Đang gửi dữ liệu tìm kiếm đến backend với các tham số:", searchData);

    // Gửi POST request đến API backend (thay URL bên dưới bằng URL API của bạn)
    axios.post('https://your-backend-api.com/search', searchData)
      .then(response => {
        console.log("Phản hồi từ backend:", response.data);
      })
      .catch(error => {
        console.error("Lỗi khi gửi dữ liệu đến backend:", error);
      });
  };



  return (
    <>
      <CContainer fluid className="bg-light py-3 px-4 rounded-4 shadow-sm">
        <CRow className="g-2 align-items-center">
          {/* Location Input */}
          <CCol xs={12} md>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText
                  className="bg-transparent border-0 cursor-pointer"
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">Địa điểm</label>
                  <CFormInput
                    type="text"
                    placeholder="Chọn địa điểm trên bản đồ"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 ps-2 pt-0"
                    onClick={() => setShowMap(true)}
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Check-in Date */}
          <CCol xs={12} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">Nhận phòng</label>
                  <CFormInput
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border-0 ps-2 pt-0"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Check-out Date */}
          <CCol xs={12} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">Trả phòng</label>
                  <CFormInput
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border-0 ps-2 pt-0"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Guests */}
          <CCol xs={12} md>
            <div className="position-relative border-start">
              <CDropdown>
                <CDropdownToggle className="w-100 bg-transparent border-0 text-start ps-3">
                  <Users className="text-primary me-2" size={20} />
                  <span className="small text-muted d-block">Khách</span>
                  <span>{guests} khách</span>
                </CDropdownToggle>
                <CDropdownMenu>
                  {[1, 2, 3, 4].map(num => (
                    <CDropdownItem key={num} onClick={() => setGuests(num)}>
                      {num} khách
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </div>
          </CCol>

          {/* Search Button */}
          <CCol xs={12} md="auto">
            <CButton
              color="danger"
              onClick={handleSearchButtonClick}
              className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
            >
              <Search size={20} />
              Tìm kiếm
            </CButton>
          </CCol>
        </CRow>

        {/* Thêm dòng bộ lọc bổ sung */}
        <CRow className="g-2 align-items-center mt-3">
          {/* Sắp xếp theo giá */}
          <CCol xs={12} md={4}>
            <CDropdown>
              <CDropdownToggle className="w-100 bg-transparent border-0 text-start ps-3">
                Sắp xếp theo giá: {sortOrder === 'asc' ? 'Thấp đến cao' : 'Cao đến thấp'}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setSortOrder('asc')}>
                  Giá thấp đến cao
                </CDropdownItem>
                <CDropdownItem onClick={() => setSortOrder('desc')}>
                  Giá cao đến thấp
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>

          {/* Số phòng ngủ tối thiểu */}
          <CCol xs={12} md={4}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Users className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">
                    Phòng ngủ tối thiểu
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Số phòng ngủ"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                    className="border-0 ps-2 pt-0"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Số phòng tắm tối thiểu */}
          <CCol xs={12} md={4}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">
                    Phòng tắm tối thiểu
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Số phòng tắm"
                    value={minBathrooms}
                    onChange={(e) => setMinBathrooms(e.target.value)}
                    className="border-0 ps-2 pt-0"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>
        </CRow>




      </CContainer>

      {/* Map Modal */}
      <CModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Chọn thành phố trên bản đồ</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="p-3">
            {/* Các nút chọn thành phố */}
            <div className="mb-4">
              <h6 className="mb-3">Các thành phố chính:</h6>
              <div className="d-flex flex-wrap gap-2">
                {cities.map((city) => (
                  <CButton
                    key={city.name}
                    color="light"
                    className="mb-2"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.name}
                  </CButton>
                ))}
              </div>
            </div>

            {/* OpenStreetMap */}
            <div style={{ height: '400px', width: '100%', marginBottom: '20px' }}>
              <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
              >
                <ChangeView center={mapCenter} zoom={zoom} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Hiển thị marker cho các căn nhà */}
                {houses.map((house) => (
                  <Marker
                    key={house.id}
                    position={[house.latitude, house.longitude]}
                  >
                    <Popup>
                      <div>
                        <h6>{house.name}</h6>
                        <p className="mb-0">{house.price}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Danh sách nhà có sẵn */}
            {selectedCity && houses.length > 0 && (
              <div>
                <h6 className="mb-3">Nhà có sẵn tại {selectedCity.name}:</h6>
                <div className="row">
                  {houses.map((house) => (
                    <div key={house.id} className="col-md-6 mb-3">
                      <div className="p-3 border rounded">
                        <h6 className="mb-2">{house.name}</h6>
                        <p className="small text-muted mb-1">{house.price}</p>
                        <p className="small text-muted mb-0">
                          Vị trí: {house.latitude}, {house.longitude}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CModalBody>
      </CModal>
    </>
  );
};

export default SearchBar;