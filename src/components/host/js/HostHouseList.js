import React , { useState , useEffect } from 'react'
import axios from 'axios'
import {
  CButton ,
  CCard ,
  CCardBody ,
  CCardFooter , CCarousel ,
  CCarouselItem ,
  CCol ,
  CImage ,
  CRow ,
  CSpinner ,
} from '@coreui/react'
import { BASE_URL_HOUSE } from '../../../constants/api'
import { setHouses } from '../../../redux/slices/houseSlice'
import { useNavigate , useParams } from 'react-router-dom'
import { useDispatch , useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'
import { cilBath , cilBed , cilLocationPin } from '@coreui/icons'
import styles from '../css/HouseList.module.css'

export default function HostHouseList() {
  const houseList = useSelector ( state => state.houses.list )
  const [loading , setLoading] = useState ( true )
  const [error , setError] = useState ( null )
  const dispatch = useDispatch ()
  const navigate = useNavigate ()
  const hostId = localStorage.getItem ( 'userId' )

  useEffect ( () => {
    const getHousesByHostId = async () => {
      setLoading ( true )
      setError ( null )
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/host/${hostId}` )
        dispatch ( setHouses ( response.data ) )
      } catch (err) {
        setError ( 'Failed to fetch house details. Please try again.' )
        console.log ( err )
      } finally {
        setLoading ( false )
      }
    }
    getHousesByHostId ()
  } , [] )

  if (loading) {
    return (
      <CCard className="mt-4 bg-warning justify-content-center rounded-3">
        <CSpinner color="primary" /> Loading
      </CCard>
    )
  }
  if (error) {
    return (
      <CCard className="mt-2 bg-warning justify-content-center rounded-3">
        <CCardBody className="text-center text-white">
          {error}
        </CCardBody>
      </CCard>
    )
  }
  if (!houseList) {
    return (
      <CCard className="mt-4 rounded-3 bg-primary-subtle">
        <CCardBody className="text-center p-4 mt-3">
          You don’t have any guests checking out today or tomorrow.
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CRow className="mt-4 g-4">
      {houseList.map ( (house) => (
        <CCol xs={12} md={6} lg={4} key={house.id}>
          <CCard className="h-100 shadow-sm rounded-3" style={{ border: 'none' }}>
            <CCardBody>
              {/* House Images Carousel */}
              {house.houseImages && house.houseImages.length > 0 && (
                <CCarousel controls indicators interval={false} className="rounded - 3 overflow-hidden">
                  {house.houseImages.map ( (image) => (
                    <CCarouselItem key={image.id}>
                      <CImage
                        className="d-block w-100"
                        src={`/images/${image.fileName}`}
                        alt={house.houseName}
                        style={{ height: '200px' , objectFit: 'cover' }}
                      />
                    </CCarouselItem>
                  ) )}
                </CCarousel>
              )}
              <div className="mt-3">
                <h5 className="card-title fw-bold">{house.houseName}</h5>
                <p className="text-muted mb-1">
                  <CIcon icon={cilLocationPin} size="sm" className="me-1" />
                  {house.address}
                </p>
                <p className="mb-1">
                  <CIcon icon={cilBed} size="sm" className="me-1 text-warning" />
                  {house.bedrooms} Bedrooms
                </p>
                <p className="mb-1">
                  <CIcon icon={cilBath} size="sm" className="me-1 text-primary" />
                  {house.bathrooms} Bathrooms
                </p>
                <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                  {house.description.length > 50
                    ? `${house.description.substring ( 0 , 50 )}...`
                    : house.description}
                </p>
                <p className="fw-bold mb-0">{house.price.toLocaleString ()} VND/day</p>
              </div>
            </CCardBody>
            <CCardFooter className="bg-light d-flex justify-content-between align-items-center">
              <span className="text-muted">Status: {house.status || 'Not specified'}</span>
              <CButton
                color="primary"
                size="sm"
                onClick={() => navigate ( `/host/update/${house.id}` )}
              >
                Update
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      ) )}
    </CRow>
  )
}