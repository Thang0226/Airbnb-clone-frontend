import { useDispatch , useSelector } from 'react-redux'
import { setHouse } from '../../redux/slices/houseSlice'
import { useNavigate , useParams } from 'react-router-dom'
import { useEffect , useState } from 'react'
import axios from 'axios'
import { BASE_URL_HOUSE } from '../../constants/api'
import {
  CCard ,
  CCardBody ,
  CCardHeader ,
  CCol ,
  CRow ,
  CSpinner ,
  CCarousel ,
  CCarouselItem ,
  CImage ,
} from '@coreui/react'

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
    getHouseById ()

    return () => {
      dispatch(setHouse(null));
    }; // cleanup state
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
      <CCol xs={12} md={8}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>{selectedHouse.houseName}</h2>
          </CCardHeader>
          <CCardBody>
            {/* House Images Carousel */}
            {selectedHouse.houseImages && selectedHouse.houseImages.length > 0 && (
              <CCarousel controls indicators>
                {selectedHouse.houseImages.map ( (image) => (
                  <CCarouselItem key={image.id}>
                    <CImage
                      className="d-block w-100"
                      src={`/images/${image.fileName}`}
                      alt={image.fileName}
                    />
                  </CCarouselItem>
                ) )}
              </CCarousel>
            )}

            {/* House Details */}
            <div className="mt-3">
              <p><strong>Address:</strong> {selectedHouse.address}</p>
              <p><strong>Bedrooms:</strong> {selectedHouse.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {selectedHouse.bathrooms}</p>
              <p><strong>Description:</strong> {selectedHouse.description}</p>
              <p><strong>Price:</strong> {selectedHouse.price.toLocaleString ()} VND/day</p>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}