import { useDispatch, useSelector } from 'react-redux'
import { setHouse } from '../../../redux/slices/houseSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCarousel,
  CCarouselItem,
  CCol,
  CImage,
  CLink,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBath, cilBed, cilExternalLink, cilLocationPin } from '@coreui/icons'
import { BASE_URL_HOUSE } from '../../../constants/api'
import HostHouseReviews from './HostHouseReviews'

export default function HostHouseDetails() {
  const { houseId } = useParams ()
  const selectedHouse = useSelector ( state => state.houses.house )
  const dispatch = useDispatch ()
  const [loading , setLoading] = useState ( false )
  const [error , setError] = useState ( null )
  const navigate = useNavigate ()

  useEffect ( () => {
    document.title = 'Airbnb | House Details'
  } , [] )

  useEffect ( () => {
    const getHouseById = async () => {
      setLoading ( true )
      setError ( null )
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/${houseId}` )
        dispatch ( setHouse ( response.data ) )
      } catch (err) {
        setError ( 'Failed to fetch house details. Please try again.' )
        console.log ( err )
      } finally {
        setLoading ( false )
      }
    }
    getHouseById ()

    return () => {
      dispatch ( setHouse ( null ) )
    } // cleanup state
  } , [houseId , dispatch] )

  if (loading) {
    return (
      <CRow className="justify-content-center">
        <CSpinner color="primary" />
      </CRow>
    )
  }

  if (error) {
    return (
      <CRow className="justify-content-center">
        <CCol xs={12} className="text-center text-warning">
          {error}
        </CCol>
      </CRow>
    )
  }

  if (!selectedHouse) {
    return (
      <CRow className="justify-content-center">
        <CCol xs={12} className="text-center">
          No house data available.
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={10}>
        <CCard className="mb-3" style={{ border: 'none' }}>
          <CCardHeader className="bg-white" style={{ border: 'none' }}>
            <h2>🏡 {selectedHouse.houseName}</h2>
          </CCardHeader>
          <CCardBody>
            {/* Images */}
            {selectedHouse.houseImages && selectedHouse.houseImages.length > 0 && (
              <CCarousel controls indicators style={{ borderRadius: '16px' , overflow: 'hidden' , zIndex: 0 }}>
                {selectedHouse.houseImages.map ( (image) => (
                  <CCarouselItem key={image.id}>
                    <CImage
                      className="d-block w-100"
                      src={`/images/${image.fileName}`}
                      alt={image.fileName}
                      style={{ height: '400px' , objectFit: 'cover' }}
                    />
                  </CCarouselItem>
                ) )}
              </CCarousel>
            )}

            {/* House Details */}
            <CRow className="mt-4 mb-0">
              {/* Left column */}
              <CCol xs={12} md={6}>
                <CRow className="mb-3 align-items-center">
                  <CCol xs={2} className="text-center">
                    <CIcon icon={cilBed} size={'xxl'} className="text-warning" />
                  </CCol>
                  <CCol xs={8}>
                    <strong>{selectedHouse.bedrooms} Bedrooms</strong>
                  </CCol>
                </CRow>

                <CRow className="mb-3 align-items-center">
                  <CCol xs={2} className="text-center">
                    <CIcon icon={cilBath} size={'xxl'} className="text-warning" />
                  </CCol>
                  <CCol xs={8}>
                    <strong>{selectedHouse.bathrooms} Bathrooms</strong>
                  </CCol>
                </CRow>

                <CRow className="mb-3 align-items-center">
                  <CCol xs={2} className="text-center">
                    <CIcon icon={cilLocationPin} size={'xxl'} className="text-warning" />
                  </CCol>
                  <CCol xs={8}>
                    <CLink
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent ( selectedHouse.address )}`}
                      className="text-decoration-none text-black" target="_blank">
                      <strong>{selectedHouse.address} <CIcon icon={cilExternalLink} /></strong>
                    </CLink>
                  </CCol>
                </CRow>
              </CCol>

              {/* Right column */}
              <CCol xs={12} md={6}>
                <div className="mb-1">
                  <h5 className="fw-bolder">About this space</h5>
                  <p style={{lineHeight: '1.5em', minHeight: '4.5em', marginBottom: '8px'}}>{selectedHouse.description}</p>
                </div>
                <CRow className="w-50 align-items-center ">
                  <CButton color="primary"
                           onClick={() => navigate ( `/host/update/${houseId}` )}>Update</CButton>
                </CRow>
              </CCol>
            </CRow>
            {/*Reviews*/}
            <HostHouseReviews />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )

}