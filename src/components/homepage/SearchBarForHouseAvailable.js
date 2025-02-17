import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setHouses } from '../../redux/houseSlice'
import MapSample from './MapSampletoSearch'
import './HouseList.css'
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
} from '@coreui/react'
import { Search, Calendar, Users } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to change map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap()
  map.setView(center, zoom)
  return null
}


const SearchBar = ({ onSearch }) => {
  const dispatch = useDispatch()
  // const [location, setLocation] = useState('');
  const [address, setAddress] = useState('')
  const [checkIn, setCheckIn] = useState('2024-02-20')
  const [checkOut, setCheckOut] = useState('2024-03-10')
  const [guests, setGuests] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minBathrooms, setMinBathrooms] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)
  const [houses] = useState([])
  const [mapCenter, setMapCenter] = useState([16.047079, 108.206230]) // Default address (Da Nang)
  const [zoom, setZoom] = useState(5)

  //mapData chứa thông tin định dạng của địa chỉ, gồm 2 trườn
//selectedAddressData lưu toàn bộ dữ liệu địa chỉ được chọn (nếu cần dùng cho các xử lý khác).
  const [mapData, setMapData] = useState({
    name: '',
    address: '',
  })
  const [selectedAddressData, setSelectedAddressData] = useState(null)

  const handleAddressSelect = (addressData) => {
    setMapData({
      name: addressData.formattedAddress,
      address: addressData.addressComponents,
    })
    setSelectedAddressData(addressData)
  }


  // Sample houses data
  const sampleHouses = [
    {
      id: 1,
      city: 'Ho Chi Minh City',
      latitude: 10.7769,
      longitude: 106.7009,
      name: 'Mini condominium in District 1',
      price: '$600/day',
    },
    {
      id: 2,
      city: 'Lao Cai',
      latitude: 22.3364,
      longitude: 103.8430,
      name: 'Mountain view guesthouse in Sapa',
      price: '$700/day',
    },
  ]

  // List of major cities
  const cities = [
    { name: 'Ho Chi Minh City', lat: 10.7769, lng: 106.7009 },
    { name: 'Hanoi', lat: 21.0285, lng: 105.8542 },
    { name: 'Da Nang', lat: 16.0544, lng: 108.2022 },
    { name: 'Lao Cai', lat: 22.3364, lng: 103.8430 },
    { name: 'Nha Trang', lat: 12.2388, lng: 109.1967 },
    { name: 'Can Tho', lat: 10.0452, lng: 105.7469 },
  ]

  // const handleCitySelect = (city) => {
  //   setSelectedCity(city);
  //   setLocation(city.name);
  //   setMapCenter([city.lat, city.lng]);
  //   setZoom(12);
  //
  //   // Filter houses by selected city
  //   const filteredHouses = sampleHouses.filter(house =>
  //     house.city === city.name
  //   );
  //   dispatch(setHouses(filteredHouses));
  // };

  const handleSearchButtonClick = () => {
    const searchData = {
      address: mapData.name,
      checkIn,
      checkOut,
      guests,
      sortOrder,
      minBedrooms,
      minBathrooms,
    }
    console.log('Sending search data to backend:', searchData)

    axios.post('http://localhost:8080/api/houses/search', searchData, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        console.log('Backend response:', response.data)
        dispatch(setHouses(response.data))
        if (onSearch) {
          onSearch(searchData)
        }
      })
      .catch(error => {
        console.error('Error sending search data to backend:', error)
      })
  }

  return (
    <>
      <CContainer fluid className="bg-light py-3 px-4 rounded-4 shadow-sm">
        <CRow className="g-3 align-items-center">
          {/* Map Search Input */}
          <CCol xs={12} md>
            <label className="form-label fw-bold mb-1">Search Address</label>
            <MapSample
              value={mapData.name}
              onChange={(newValue) =>
                setMapData((prev) => ({ ...prev, name: newValue }))
              }
              onAddressSelect={handleAddressSelect}
            />
          </CCol>

          {/* Check-In Date */}
          <CCol xs={12} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">Check-In</label>
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

          {/* Check-Out Date */}
          <CCol xs={12} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">Check-Out</label>
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
                  <span className="small text-muted d-block">Guests</span>
                  <span>{guests} guest{guests > 1 ? 's' : ''}</span>
                </CDropdownToggle>
                <CDropdownMenu>
                  {[1, 2, 3, 4].map(num => (
                    <CDropdownItem key={num} onClick={() => setGuests(num)}>
                      {num} guest{num > 1 ? 's' : ''}
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
              Search
            </CButton>
          </CCol>
        </CRow>

        {/* Additional Filters */}
        <CRow className="g-3 align-items-center mt-3">
          {/* Sort by Price */}
          <CCol xs={12} md={4}>
            <CDropdown>
              <CDropdownToggle className="w-100 bg-transparent border-0 text-start ps-3">
                Sort by Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setSortOrder('asc')}>
                  Low to High
                </CDropdownItem>
                <CDropdownItem onClick={() => setSortOrder('desc')}>
                  High to Low
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>

          {/* Minimum Bedrooms */}
          <CCol xs={12} md={4}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Users className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">
                    Minimum Bedrooms
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Bedrooms"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                    className="border-0 ps-2 pt-0"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Minimum Bathrooms */}
          <CCol xs={12} md={4}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={20} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="small text-muted mb-0 ms-2">
                    Minimum Bathrooms
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Bathrooms"
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
      <CModal visible={showMap} onClose={() => setShowMap(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Select a City on the Map</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="p-3">
            {/* City selection buttons */}
            <div className="mb-4">
              <h6 className="mb-3">Major Cities:</h6>
              <div className="d-flex flex-wrap gap-2">
                {cities.map((city) => (
                  <CButton
                    key={city.name}
                    color="light"
                    className="mb-2"
                    // onClick={() => handleCitySelect(city)}
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

            {/* Available houses list */}
            {selectedCity && houses.length > 0 && (
              <div>
                <h6 className="mb-3">Available Houses in {selectedCity.name}:</h6>
                <div className="row">
                  {houses.map((house) => (
                    <div key={house.id} className="col-md-6 mb-3">
                      <div className="p-3 border rounded">
                        <h6 className="mb-2">{house.name}</h6>
                        <p className="small text-muted mb-1">{house.price}</p>
                        <p className="small text-muted mb-0">
                          {/*Location: {house.latitude}, {house.longitude}*/}
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
  )
}

export default SearchBar
