import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setHouses } from '../../redux/slices/houseSlice'
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
} from '@coreui/react'
import { Search, Calendar, Users } from 'lucide-react'
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


const SearchBar = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const dispatch = useDispatch()
  const [checkIn, setCheckIn] = useState(today.toISOString().split('T')[0])
  const [checkOut, setCheckOut] = useState(tomorrow.toISOString().split('T')[0])
  const [sortOrder, setSortOrder] = useState('ASC')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minBathrooms, setMinBathrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  //mapData chứa thông tin định dạng của địa chỉ, gồm 2 trường
  //selectedAddressData lưu toàn bộ dữ liệu địa chỉ được chọn (nếu cần dùng cho các xử lý khác).
  const [mapData, setMapData] = useState({
    name: '',
    address: '',
  })

  const handleAddressSelect = (addressData) => {
    setMapData({
      name: addressData.formattedAddress,
      address: addressData.addressComponents,
    })
  }

  const handleSearchButtonClick = () => {
    const searchData = {
      address: mapData.name,
      checkIn,
      checkOut,
      sortOrder,
      minBedrooms,
      minBathrooms,
      minPrice,
      maxPrice,
    }
    console.log('Sending search data to backend:', searchData)

    axios.post('http://localhost:8080/api/houses/search', searchData, {
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        console.log('Backend response:', response.data)
        dispatch(setHouses(response.data))
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
                Sort by Price: {sortOrder === 'ASC' ? 'Low to High' : 'High to Low'}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setSortOrder('ASC')}>
                  Low to High
                </CDropdownItem>
                <CDropdownItem onClick={() => setSortOrder('DESC')}>
                  High to Low
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>


          {/* Price Range Dropdown */}
          <CCol xs={12} md={4}>
            <CDropdown>
              {/* Toggle hiển thị giá đã chọn (hoặc “Select Range”) */}
              <CDropdownToggle className="w-100 bg-transparent border-0 text-start ps-3">
                Price Range (VND):{' '}
                {minPrice && maxPrice
                  ? `${minPrice} - ${maxPrice}`
                  : 'Select Range'}
              </CDropdownToggle>

              <CDropdownMenu style={{ minWidth: '250px' }}>
                {/* 1) Các mức gợi ý */}
                <CDropdownItem
                  onClick={() => {
                    setMinPrice(100000)
                    setMaxPrice(200000)
                  }}
                >
                  100.000 - 200.000
                </CDropdownItem>
                <CDropdownItem
                  onClick={() => {
                    setMinPrice(200000)
                    setMaxPrice(500000)
                  }}
                >
                  200.000 - 500.000
                </CDropdownItem>
                <CDropdownItem
                  onClick={() => {
                    setMinPrice(500000)
                    setMaxPrice(1000000)
                  }}
                >
                  500.000 - 1.000.000
                </CDropdownItem>
                <CDropdownItem divider="true" />

                {/* 2) Cho phép nhập thủ công */}
                <div className="px-3 py-2">
                  <label className="form-label mb-1 fw-semibold">Custom Range</label>
                  <div className="d-flex gap-2 mb-2">
                    <CFormInput
                      type="number"
                      placeholder="Min"
                      min={100000}
                      max={1000000}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <CFormInput
                      type="number"
                      placeholder="Max"
                      min={100000}
                      max={1000000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => {
                      // Bấm "Apply" => đóng Dropdown (nếu muốn)
                      // => Tự động filter khi Search
                    }}
                  >
                    Apply
                  </CButton>
                </div>
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
    </>
  )
}

export default SearchBar
