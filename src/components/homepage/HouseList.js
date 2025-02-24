import React , { useState , useEffect } from 'react'
import axios from 'axios'
import HouseCarousel from './HouseCarousel'
import { useDispatch , useSelector } from 'react-redux'
import {
  CCardBody,
  CRow,
  CCol,
  CContainer, CNavLink,
} from '@coreui/react'
import './HouseList.css'
import { BASE_URL_HOUSE } from '../../constants/api'
import { setHouses } from '../../redux/slices/houseSlice'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const HouseList = () => {
  const houseList = useSelector ( state => state.houses.list )
  const [loading , setLoading] = useState ( true )
  const dispatch = useDispatch ()
  const navigate = useNavigate ()

  useEffect ( () => {
    axios
      .get ( `${BASE_URL_HOUSE}` )
      .then ( (response) => {
        // console.log(response.data)
        dispatch ( setHouses ( response.data ) )
        setLoading ( false )
      } )
      .catch ( (error) => {
        console.error ( 'There was an error fetching the data!' , error )
      } )
  } , [] )

  if (loading) {
    return <div>Loading...</div>
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat ( 'vi-VN' , {
      style: 'decimal' ,
      maximumFractionDigits: 0 ,
    } ).format ( price )
  }

  return (
    <CContainer className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0 fw-bold">Houses for you</h2>
        <div className="d-flex gap-3">
          <CNavLink href="#" className="text-decoration-none text-primary">
            Top 5 Most Rented Rooms
          </CNavLink>
          <span className="text-muted">|</span>
          <CNavLink href="#" className="text-decoration-none text-primary">
            View Full List.
          </CNavLink>
        </div>
      </div>
      <CRow xs={{ cols: 1 }} md={{ cols: 2 }} lg={{ cols: 4 }} className="g-4">
        {houseList.map ( (house) => (
          <CCol key={house.id}>
            <div className="card h-100 shadow-sm border-0 position-relative hover-shadow"
                 onClick={() => navigate ( `/houses/${house.id}` )}>
              <div className="position-relative">
                {/* Sử dụng HouseCarousel để hiển thị danh sách hình */}
                <HouseCarousel images={house.houseImages} height="150px" />
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
                    display: '-webkit-box' ,
                    WebkitLineClamp: 2 ,
                    WebkitBoxOrient: 'vertical' ,
                    overflow: 'hidden' ,
                  }}
                >
                  {house.houseName}
                </p>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="fw-bold" style={{ color: '#D13660' }}>
                    {formatPrice ( house.price )} đ/ngày
                  </span>
                  <span className="text-muted">·</span>
                  <span>{house.bedrooms}{(house.bedrooms > 1) ? ' bedrooms' : ' bedroom'}</span>
                </div>

                <div className="d-flex align-items-center text-muted" style={{ minHeight: '3rem' }}>
                  <FaMapMarkerAlt className="me-2" />
                  <small>
                    {house.address}
                  </small>
                </div>
              </CCardBody>
            </div>
          </CCol>
        ) )}
      </CRow>
    </CContainer>
  )
}

export default HouseList