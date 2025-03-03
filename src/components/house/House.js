import { useDispatch , useSelector } from 'react-redux'
import { setHouse } from '../../redux/slices/houseSlice'
import { useParams } from 'react-router-dom'
import { useEffect , useState } from 'react'
import axios from 'axios'
import { BASE_URL_HOUSE } from '../../constants/api'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CCarousel,
  CCarouselItem,
  CImage, CLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBath ,
  cilBed ,
  cilExternalLink ,
  cilLocationPin ,
} from '@coreui/icons'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import HouseRent from './HouseRent'
import HouseReviews from './HouseReviews'

export default function House() {
  const selectedHouse = useSelector ( state => state.houses.house )
  const { id } = useParams ()
  const dispatch = useDispatch ()
  const [loading , setLoading] = useState ( false )
  const [error , setError] = useState ( null )

  useEffect ( () => {
    document.title = 'Airbnb | House Details'
  } , [] )

  useEffect ( () => {
    const getHouseById = async () => {
      setLoading ( true )
      setError ( null )
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/${id}` )
        dispatch ( setHouse ( response.data ) )
      } catch (err) {
        setError ( 'Failed to fetch house details. Please try again.' )
        console.log ( err )
      } finally {
        setLoading ( false )
      }
    }
    getHouseById()

    return () => {
      dispatch ( setHouse ( null ) )
    } // cleanup state
  } , [id , dispatch] )


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
        <CCard className="mb-4" style={{ border: 'none' }}>
          <CCardHeader className="bg-white" style={{ border: 'none' }}>
            <h2>🏡 {selectedHouse.houseName}</h2>
          </CCardHeader>
          <CCardBody>
            {/* Images */}
            {selectedHouse.houseImages && selectedHouse.houseImages.length > 0 && (
              <CCarousel controls indicators style={{ borderRadius: '16px' , overflow: 'hidden', zIndex: 0 }}>
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
            <CRow className="mt-5 mb-3">
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
                  <div className="p-3">
                    <h5>About this space</h5>
                    <span>{selectedHouse.description}</span>
                  </div>
              </CCol>

              {/* Right column */}
              <CCol xs={12} md={6}>
                    <h4 className="mb-2 text-center"><CurrencyFormat value={selectedHouse.price} />/night</h4>
                    <HouseRent houseId={id}/>
              </CCol>
            </CRow>
            <HouseReviews/>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}