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
  CTableDataCell, CButton,
} from '@coreui/react'
import { BASE_URL } from '../../../constants/api'
import UserInfoRow from '../../_fragments/FORMInfoRow'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'

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
      .get(`http://localhost:8080/api/admin/hosts/${id}`, {
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
          onClick={() => navigate('/admin')}
        >
          Dashboard
        </span>
        <span className="mx-1">/</span>
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate('/admin/hosts')}
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
                src={
                  host.avatar
                    ? `${BASE_URL}/images/${host.avatar}`
                    : `${BASE_URL}/images/default.jpg`
                }
                alt={host.username}
                className="rounded-circle border border-white border-4"
                width="150"
                height="150"
                style={{ objectFit: 'cover' }}
              />
              <h3 className="mt-3">{host.username}</h3>
              <CBadge
                color={host.status === 'ACTIVE' ? 'success' : 'secondary'}
                className="py-2 mt-2"
                style={{ width: '90px' }}
              >
                {host.status}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <UserInfoRow label="Full Name" value={host.fullName} />
              <UserInfoRow label="Phone number" value={host.phone} />
              <UserInfoRow label="Address" value={host.address} />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={12} md={12} lg={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4 bg-secondary text-white">
              <h3>Host Statistics</h3>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <UserInfoRow label="Houses Listed" value={host.housesForRent ? host.housesForRent : '0'} />
              <UserInfoRow label="Total Income" value={<CurrencyFormat value={host.totalIncome} />} />
              <div className="d-flex align-items-center fw-bold">
                Danh sách nhà
                <CButton
                  size="sm"
                  className="ms-2 border"
                  style={{
                    backgroundColor: "#f8f9fa",
                  }}
                  // onClick={}
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </CButton>
              </div>
              <div>(bổ sung onclick navigate đến danh sách house của host trong sprint 3)</div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default HostDetail
