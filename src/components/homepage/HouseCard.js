import { BASE_URL } from '../../constants/api'
import { CCard , CCardBody , CCarousel , CCarouselItem , CImage , CRow } from '@coreui/react'
import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBath , cilBed , cilLocationPin } from '@coreui/icons'

const HouseCard = ({ house }) => {
  return (
    <CCardBody>
      <CCarousel controls indicators interval={false} className="rounded-3 overflow-hidden">
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
      <div className="mt-3">
        <h5 className="card-title fw-bold">{house.houseName}</h5>
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
        <p className="fw-bold mt-2 text-warning">{house.price.toLocaleString ()} VND/day</p>
      </div>
    </CCardBody>
  )
}

export default HouseCard