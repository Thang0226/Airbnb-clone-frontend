import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
  CButton,
  CBadge
} from "@coreui/react";
import { Heart } from "lucide-react";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/HouseList.css";
import { BASE_URL, API_ENDPOINTS } from "../constants/api";

// Component Carousel cho hình ảnh của căn nhà
const HouseCarousel = ({ images, height = "200px" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 7000); // thay đổi hình mỗi 3 giây
      return () => clearInterval(timer);
    }
  }, [images]);

  // Nếu không có hình, hiển thị hình mặc định
  if (!images || images.length === 0) {
    return (
      <img
        src="/api/placeholder/400/300"
        alt="placeholder"
        style={{
          width: "100%",
          height: height,
          objectFit: "cover"
        }}
      />
    );
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", height: height }}>
      <div
        style={{
          display: "flex",
          transition: "transform 0.5s ease-in-out",
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt=""
            style={{
              width: "100%",
              flexShrink: 0,
              objectFit: "cover"
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HouseList = ({ searchParams }) => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mỗi khi searchParams thay đổi, thực hiện gọi API mới (hoặc lọc dữ liệu)
  useEffect(() => {
    setLoading(true);
    let url = `${BASE_URL}${API_ENDPOINTS.GET_HOUSES_FOR_RENTED}`;
    // Nếu có tham số tìm kiếm, nối query string (cần encode dữ liệu cho an toàn)
    if (searchParams && searchParams.location) {
      url += `?location=${encodeURIComponent(searchParams.location)}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`;
    }
    axios
      .get(url)
      .then((response) => {
        setHouses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching houses:", error);
        setLoading(false);
      });
  }, [searchParams]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div>Loading...</div>;
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
        {houses.map((house) => (
          <CCol key={house.id}>
            <div className="card h-100 shadow-sm border-0 position-relative hover-shadow">
              <div className="position-relative">
                {/* Sử dụng HouseCarousel để hiển thị danh sách hình */}
                <HouseCarousel images={house.images} height="200px" />

                <CBadge
                  color="warning"
                  className="position-absolute top-0 start-0 m-2"
                  style={{ fontSize: "0.8rem" }}
                >
                  VIP
                </CBadge>
                <CBadge
                  color="danger" // Bạn có thể thay đổi màu theo status nếu cần.
                  className="position-absolute top-0 end-0 m-2"
                  style={{ fontSize: "0.8rem" }}
                >
                  {house.status}
                </CBadge>
                <div
                  className="position-absolute bottom-0 end-0 m-2 bg-dark bg-opacity-75 rounded px-2 py-1 text-white d-flex align-items-center"
                  style={{ fontSize: "0.8rem" }}
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
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {house.name}
                </h3>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-danger fw-bold">
                    {formatPrice(house.pricePerDay)} đ/ngày
                  </span>
                  <span className="text-muted">·</span>
                  <span>{house.numberOfBedrooms} m²</span>
                </div>

                <div className="d-flex align-items-center text-muted mb-3">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <small>
                    {house.city}, {house.address}
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
  );
};

export default HouseList;