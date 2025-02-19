import React, { useState, useEffect } from 'react'
import axios from 'axios'
import HouseCarousel from './HouseCarousel'
import { useSelector } from 'react-redux'
import {
  CCardBody,
  CRow,
  CCol,
  CContainer,
  CButton,
  CBadge,
} from '@coreui/react'
import './HouseList.css'
import { BASE_URL, API_ENDPOINTS } from '../../constants/api'
import { setHouses } from '../../redux/slices/houseSlice'

const HouseList = () => {
  const houseList = useSelector(state => state.houses.list)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${BASE_URL}${API_ENDPOINTS.GET_HOUSES_FOR_RENT}`)
      .then((response) => {
        setHouses(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error)
        setLoading(false)
      })
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <CContainer className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0 fw-bold">Houses for you</h2>
        <div className="d-flex gap-3">
          <a href="#" className="text-decoration-none text-primary">
            Top 5 Most Rented Rooms
          </a>
          <span className="text-muted">|</span>
          <a href="#" className="text-decoration-none text-primary">
            View Full List.
          </a>
        </div>
      </div>
      <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
        {houseList.map((house) => (
          <CCol key={house.id}>
            <div className="card h-100 shadow-sm border-0 position-relative hover-shadow">
              <div className="position-relative">
                {/* Sử dụng HouseCarousel để hiển thị danh sách hình */}
                <HouseCarousel images={house.houseImages} height="150px" />
                <CBadge
                  color="warning"
                  className="position-absolute top-0 start-0 m-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  VIP
                </CBadge>
                <CBadge
                  color="danger" // Bạn có thể thay đổi màu theo status nếu cần.
                  className="position-absolute top-0 end-0 m-2"
                  style={{ fontSize: '0.8rem' }}
                >
                  {house.status}
                </CBadge>
                <div
                  className="position-absolute bottom-0 end-0 m-2 bg-dark bg-opacity-75 rounded px-2 py-1 text-white d-flex align-items-center"
                  style={{ fontSize: '0.8rem' }}
                >
                  <i className="fas fa-images me-1"></i>
                  <span>{house.houseImages ? house.houseImages.length : 0}</span>
                </div>
              </div>

              <CCardBody className="d-flex flex-column">
                <p
                  className="fw-bold mb-2"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {house.houseName}
                </p>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold" style={{ color: "#D13660" }}>
                    {formatPrice(house.price)} đ/ngày
                  </span>
                  <span className="text-muted">·</span>
                  <span>{house.bedrooms}{(house.bedrooms > 1) ? " bedrooms" : " bedroom"}</span>
                </div>

                <div className="d-flex align-items-center text-muted mb-3">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <small>
                    {house.address}
                  </small>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <small className="text-muted">
                    Post by:
                    {/*{house.status === "RENTED" ? "hôm nay" : "2 ngày trước"}*/}
                  </small>
                  <CButton color="light" variant="ghost" className="border-0 p-0">
                    {/* <Heart className="text-muted" size={18} /> */}
                  </CButton>
                </div>
              </CCardBody>
            </div>
          </CCol>
        ))}
      </CRow>
    </CContainer>
  )
}

export default HouseList