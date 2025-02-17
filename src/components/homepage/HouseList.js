import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
  CButton,
  CBadge,
} from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './HouseList.css'
import { BASE_URL, API_ENDPOINTS } from '../../constants/api'

// Component Carousel cho hình ảnh của căn nhà
const HouseCarousel = ({ images, height = '200px' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images && images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 7000) // thay đổi hình mỗi 3 giây
      return () => clearInterval(timer)
    }
  }, [images])

  // Nếu không có hình, hiển thị hình mặc định
  if (!images || images.length === 0) {
    return (
      <img
        src="/api/placeholder/400/300"
        alt="placeholder"
        style={{
          width: '100%',
          height: height,
          objectFit: 'cover',
        }}
      />
    )
  }


  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: height }}>
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt=""
            style={{
              width: '100%',
              flexShrink: 0,
              objectFit: 'cover',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const HouseList = () => {
  // Lấy danh sách nhà đã được lưu vào Redux (được set bởi component tìm kiếm)
  const houses = useSelector((state) => state.houses)

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price)
  }


  return (
    <CContainer className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0 fw-bold">Search</h2>
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


      {houses && houses.length > 0 ? (
        <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
          {houses.map((house) => (
            <CCol key={house.id}>
              <div className="card h-100 shadow-sm border-0 position-relative hover-shadow">
                <div className="position-relative">
                  {/* Sử dụng HouseCarousel để hiển thị danh sách hình */}
                  <HouseCarousel images={house.images} height="200px" />

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
                    <span>{house.images ? house.images.length : 0}</span>
                  </div>
                  {/* Hiển thị startDate và endDate */}
                  <div className="house-dates">
                    {new Date(house.startDate).toLocaleDateString()} - {new Date(house.endDate).toLocaleDateString()}
                  </div>
                </div>

                <CCardBody className="d-flex flex-column">
                  <h3
                    className="h6 fw-bold mb-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {house.houseName}
                  </h3>

                  <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-danger fw-bold">
                    {formatPrice(house.price)} đ/ngày
                  </span>
                    <span className="text-muted">·</span>
                    <span>{house.bedrooms} m²</span>
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
      ) : (
        <div>Không tìm thấy nhà nào hoặc chưa có kết quả tìm kiếm.</div>
      )}
    </CContainer>
  )
}

export default HouseList