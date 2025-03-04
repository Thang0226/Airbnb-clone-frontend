import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setHouses } from '../../redux/slices/houseSlice'
import {
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
} from '@coreui/react'
import { Calendar, MapPinHouse, BedDouble, Bath } from 'lucide-react'
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
  const [address, setAddress] = useState('')
  const [checkIn, setCheckIn] = useState(today.toISOString().split('T')[0])
  const [checkOut, setCheckOut] = useState(tomorrow.toISOString().split('T')[0])
  const [priceOrder] = useState('ASC')
  const [minBedrooms, setMinBedrooms] = useState('')
  const [minBathrooms, setMinBathrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSearchButtonClick = () => {
    const searchData = {
      address: address,
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
          {/* Search Input */}
          <CCol sm={6} md>
            <div className="position-relative">
              <CInputGroup className="border-0">
                <CInputGroupText className="bg-transparent border-0">
                  <MapPinHouse className="text-primary" size={30} />
                </CInputGroupText>
                <div className="d-flex flex-column flex-grow-1">
                  <label className="fw-bolder">Address</label>
                  <CFormInput
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-0 ps-2 pt-2"
                  />
                </div>
              </CInputGroup>
            </div>
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
            <div className="position-relative border-start">
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
          <CCol sm={8} md={5}>
            <div className="px-3 py-2 border-start">
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
          <CCol sm={4} md={1} className="pt-4 justify-content-center">
            <CButton
              color="primary"
              className="w-100"
              onClick={handleSearchButtonClick}
            >
              Search
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default SearchBar
