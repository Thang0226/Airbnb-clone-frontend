import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../../style/css/custom-swiiper-bullet.css'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { CCol, CContainer, CImage, CRow } from '@coreui/react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTopFiveHouse } from '../../redux/slices/houseSlice'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import { BASE_URL } from '../../constants/api'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import { useNavigate } from 'react-router-dom'

const TopFiveHousesSlider = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getTopFiveHouse())
  }, [dispatch])

  const { topFiveHouses, loading, error } = useSelector((state) => state.houses)

  if (loading.topFiveHouses || !topFiveHouses) return (
    <DisplayLoading message={'Loading Top Five Houses...'} />
  )
  if (error.topFiveHouses) return (
    <DisplayError error={error} />
  )

  return (
    <CContainer className="mt-4">
      <Swiper
        slidesPerView={3}
        spaceBetween={15}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {topFiveHouses.map((house) => (
          <SwiperSlide key={house.id}>
            <CRow className="justify-content-center">
              <CCol
                sm={12} md={12} lg={12}
              >
                <div
                  className="position-relative rounded overflow-hidden"
                  style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '260px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/houses/${house.id}`)}
                >
                  <CImage
                    src={house.image ? `${BASE_URL}/images/${house.image}` : `${BASE_URL}/images/default.png`}
                    alt={house.houseName}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 "></div>
                  <div
                    className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white p-2 rounded-bottom"
                    style={{ zIndex: 2 }}
                  >
                    <h5 className="fw-bold text-truncate">{house.houseName}</h5>
                    <h6>
                      <CurrencyFormat value={house.price} displayType={'text'} thousandSeparator={true} /> VNĐ / Ngày
                    </h6>
                    <h6 className="mb-4 text-truncate">{house.address}</h6>
                  </div>
                </div>
              </CCol>
            </CRow>
          </SwiperSlide>
        ))}
      </Swiper>
    </CContainer>
  )
}

export default TopFiveHousesSlider
