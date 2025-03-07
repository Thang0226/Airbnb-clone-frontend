import { BASE_URL } from '../../../constants/api'
import { CCardBody , CCarousel , CCarouselItem , CImage , CRow } from '@coreui/react'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilBath , cilBed , cilLocationPin } from '@coreui/icons'
import styles from './HouseList.module.css'

const HouseCard = ({ house, disableHouseView = false }) => {
  const navigate = useNavigate();

  const handleViewHouse = () => {
    if (!disableHouseView) {
      navigate(`/houses/${house.id}`);
    }
  }

  return (
    <CCardBody>
      <CCarousel controls interval={false} className={`${styles.carouselContainer} rounded-3 overflow-hidden`}>
        {house.houseImages && house.houseImages.length > 0 ?
          (
            house.houseImages.map ( (image) => (
              <CCarouselItem key={image.id}>
                <CImage
                  className="d-block w-100"
                  src={`${BASE_URL}/images/${image.fileName}`}
                  alt={house.houseName}
                  style={{ height: '200px' , objectFit: 'cover' }}
                />
              </CCarouselItem>
            ) )
          ) : (
            <CCarouselItem>
              <CImage
                className="d-block w-100"
                src={`${BASE_URL}/images/default.png`}
                alt="Default Image"
                style={{ height: '200px' , objectFit: 'cover' }}
              />
            </CCarouselItem>)
        }
      </CCarousel>
      <div className="mt-3 house-click fs-6" onClick={() => handleViewHouse()}>
        <h6 className="card-title fw-bold">{house.houseName}</h6>
        <p className="text-muted mb-1 text-truncate">
          <CIcon icon={cilLocationPin} size="sm" className="me-1" />
          {house.address}
        </p>
        <CRow className="mb-1 text-muted">
          <CIcon icon={cilBed} size="sm" className="me-1 " />
          {house.bedrooms} Bedrooms
          <CIcon icon={cilBath} size="sm" className="me-1 ms-1" />
          {house.bathrooms} Bathrooms
        </CRow>
        <p className="fw-bold mt-2 text-primary">{house.price.toLocaleString ()} VND/day</p>
      </div>
    </CCardBody>
  )
}

export default HouseCard