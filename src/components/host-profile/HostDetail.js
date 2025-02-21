import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CImage,
  CSpinner,
  CLink,
} from '@coreui/react'

const HostDetail = () => {
  const { id } = useParams()
  const [host, setHost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/admin/hosts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setHost(response.data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Không thể tải dữ liệu')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <CContainer className="text-center py-5">
        <CSpinner color="primary" />
        <p>Đang tải...</p>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer className="text-center py-5">
        <p>{error}</p>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4">
      {/* Thông tin chủ nhà */}
      <CCard className="mb-4">
        <CCardHeader className="text-center">
          <CImage
            src={host.avatar || '/images/default-avatar.png'}
            rounded
            width={100}
            height={100}
            className="mb-3"
          />
          <h2>{host.fullName} (@{host.username})</h2>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md="6">
              <p>
                <strong>Số điện thoại:</strong> {host.phone}
              </p>
            </CCol>
            <CCol md="6">
              <p>
                <strong>Địa chỉ:</strong> {host.address}
              </p>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <p>
                <strong>Tổng doanh thu:</strong>{' '}
                {host.totalRevenue.toLocaleString()} VNĐ
              </p>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Danh sách nhà cho thuê */}
      <CCard>
        <CCardHeader>
          <h3>Danh sách nhà đang cho thuê</h3>
        </CCardHeader>
        <CCardBody>
          {host.houses && host.houses.length > 0 ? (
            host.houses.map((house) => (
              <CCard className="mb-3" key={house.id}>
                <CCardHeader>
                  <h4>{house.houseName}</h4>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    <CCol md="8">
                      <p>
                        <strong>Địa chỉ:</strong> {house.address}
                      </p>
                      <p>
                        <strong>Số phòng ngủ:</strong> {house.bedrooms} -{' '}
                        <strong>Số phòng tắm:</strong> {house.bathrooms}
                      </p>
                      <p>{house.description}</p>
                      <p>
                        <strong>Giá:</strong> {house.price.toLocaleString()} VNĐ
                      </p>
                    </CCol>
                    <CCol md="4">
                      {house.houseImages &&
                        house.houseImages.map((image) => (
                          <CImage
                            key={image.id}
                            src={`/images/${image.fileName}`}
                            rounded
                            width={80}
                            height={80}
                            className="mb-2 me-2"
                          />
                        ))}
                    </CCol>
                  </CRow>
                  <div className="mt-3">
                    <CLink
                      as={Link}
                      to={`/houses?hostId=${host.id}&houseId=${house.id}`}
                      className="text-primary"
                    >
                      Xem chi tiết
                    </CLink>
                  </div>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <p>Không có nhà nào được đăng ký cho thuê.</p>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default HostDetail
