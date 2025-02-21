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
import { Search, Calendar, Users, BedDouble, Bath } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IMaskInput } from 'react-imask'
import { BASE_URL_HOUSE } from '../../constants/api'

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
  const [priceOrder, setPriceOrder] = useState('')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minBathrooms, setMinBathrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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
      checkIn: checkIn,
      checkOut: checkOut,
      minBedrooms: minBedrooms,
      minBathrooms: minBathrooms,
      minPrice: minPrice,
      maxPrice: maxPrice,
      priceOrder: priceOrder
    }
    console.log('Sending search data to backend:', searchData)
    axios.post(`${BASE_URL_HOUSE}`, searchData, {
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
      <CContainer fluid className="bg-light px-4 pb-1 rounded-4 shadow-sm">
        <CRow className="g-3 align-items-center mb-1">
          {/* Map Search Input */}
          <CCol sm={6} md>
            <label className="fw-bolder mb-1">Search Address</label>
            <MapSample
              value={mapData.name}
              onChange={(newValue) =>
                setMapData((prev) => ({ ...prev, name: newValue }))
              }
              onAddressSelect={handleAddressSelect}
            />
          </CCol>

          {/* Check-In Date */}
          <CCol sm={6} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={30} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="fw-bolder">Check-In</label>
                  <CFormInput
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="border-0 ps-2 pt-2"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Check-Out Date */}
          <CCol sm={6} md>
            <div className="position-relative border-start">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Calendar className="text-primary" size={30} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="fw-bolder">Check-Out</label>
                  <CFormInput
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="border-0 ps-2 pt-2"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Sort by Price */}
          <CCol sm={6} md={2} className="justify-content-center pt-3">
            <CDropdown>
              <CDropdownToggle color="secondary">
                {priceOrder ? ((priceOrder === 'ASC') ? "Price: Low to High" : "Price: High to Low") : "Sort by Price"}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setPriceOrder('ASC')} style={{cursor: 'pointer'}}>
                  Low to High
                </CDropdownItem>
                <CDropdownItem onClick={() => setPriceOrder('DESC')} style={{cursor: 'pointer'}}>
                  High to Low
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CCol>
        </CRow>

        <CRow className="g-3 align-items-center mb-1">
          {/* Minimum Bedrooms */}
          <CCol sm={6} md={3}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <BedDouble className="text-primary" size={30} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="fw-bolder">
                    Minimum Bedrooms
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Enter number"
                    value={minBedrooms}
                    onChange={(e) => setMinBedrooms(e.target.value)}
                    className="border-0 ps-2 pt-2"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Minimum Bathrooms */}
          <CCol sm={6} md={3}>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <Bath className="text-primary" size={30} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="fw-bolder">
                    Minimum Bathrooms
                  </label>
                  <CFormInput
                    type="number"
                    min="0"
                    placeholder="Enter number"
                    value={minBathrooms}
                    onChange={(e) => setMinBathrooms(e.target.value)}
                    className="border-0 ps-2 pt-2"
                  />
                </div>
              </CInputGroup>
            </div>
          </CCol>

          {/* Price Range */}
          <CCol sm={8} md={4}>
            <div className="px-3 py-2">
              <label className="form-label mb-1 fw-semibold">Price Range (VND)</label>
              <div className="d-flex gap-2">
                <IMaskInput
                  mask={Number} // Numeric mask
                  thousandsSeparator="."
                  inputMode="numeric"
                  className="form-control"
                  style={{ textAlign: "right" }}
                  id="minPrice"
                  placeholder="Min"
                  value={minPrice}
                  onAccept={(val, mask) => setMinPrice(mask.unmaskedValue)}
                />
                <IMaskInput
                  mask={Number} // Numeric mask
                  thousandsSeparator="."
                  inputMode="numeric"
                  className="form-control"
                  style={{ textAlign: "right" }}
                  id="maxPrice"
                  placeholder="Max"
                  value={maxPrice}
                  onAccept={(val, mask) => setMaxPrice(mask.unmaskedValue)}
                />
              </div>
            </div>
          </CCol>

          {/* Search Button */}
          <CCol sm={4} md={2} className="pt-4 justify-content-center">
            <CButton
              color="primary"
              className="ms-4"
              onClick={handleSearchButtonClick}
            >
              <Search size={20} />
              Search
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default SearchBar
