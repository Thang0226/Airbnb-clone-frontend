import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const HostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [host, setHost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Airbnb | Host Details'
  }, [])

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/admin/host/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        setHost(response.data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Unable to load data')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <CContainer className="text-center py-5">
        <CSpinner color="primary" size="xl" />
        <p className="mt-3 fs-4">Loading...</p>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer className="text-center py-5">
        <p className="text-danger fs-5">{error}</p>
      </CContainer>
    )
  }

  return (
    <CContainer className="py-4">
      {/* Breadcrumb Navigation */}
      <div className="d-flex align-items-center mb-4">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate(-2)}
        >
          Dashboard
        </span>
        <span className="mx-1">/</span>
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate(-1)}
        >
          Host List
        </span>
        <span className="mx-1">/</span>
        <span>Host Details</span>
      </div>

      {/* Host Information & Statistics */}
      <CRow className="justify-content-center">
        <CCol xs={12} sm={12} md={12} lg={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4 bg-primary text-white">
              <CImage
                src={host.avatar || '/images/default-avatar.png'}
                alt={host.username}
                className="rounded-circle border border-white border-4"
                width="150"
                height="150"
                style={{ objectFit: 'cover' }}
              />
              <h3 className="mt-3">{host.fullName}</h3>
              <p className="mb-0">@{host.username}</p>
              <CBadge
                color={host.status === 'ACTIVE' ? 'success' : 'secondary'}
                className="py-2 mt-2"
                style={{ width: '90px' }}
              >
                {host.status}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-4">
              <p className="fs-5">
                <strong>Phone:</strong> {host.phone}
              </p>
              <p className="fs-5">
                <strong>Address:</strong> {host.address}
              </p>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={12} md={12} lg={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4 bg-secondary text-white">
              <h3>Host Statistics</h3>
            </CCardHeader>
            <CCardBody className="p-4">
              <p className="fs-5">
                <strong>Houses Listed:</strong> {host.houses ? host.houses.length : 0}
              </p>
              <p className="fs-5">
                <strong>Total Revenue:</strong>{' '}
                {host.totalRevenue ? host.totalRevenue.toLocaleString() : '0'} VNĐ
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* House Listings Table */}
      <CRow className="mt-5">
        <CCol>
          <CCard className="shadow">
            <CCardHeader>
              <h4 className="my-3">🏠 House Listings 🏠</h4>
            </CCardHeader>
            <CCardBody>
              {host.houses && host.houses.length > 0 ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>House Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Address</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Bedrooms</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Bathrooms</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Price</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {host.houses.map((house) => (
                      <CTableRow key={house.id}>
                        <CTableDataCell>{house.houseName}</CTableDataCell>
                        <CTableDataCell className="text-center">{house.address}</CTableDataCell>
                        <CTableDataCell className="text-center">{house.bedrooms}</CTableDataCell>
                        <CTableDataCell className="text-center">{house.bathrooms}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          {house.price ? house.price.toLocaleString() : ''} VNĐ
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CLink
                            as={Link}
                            to={`/houses?hostId=${host.id}&houseId=${house.id}`}
                            className="btn btn-outline-primary"
                          >
                            View Details
                          </CLink>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center">
                  <h4 className="m-0">There are no houses listed by this host.</h4>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default HostDetail
