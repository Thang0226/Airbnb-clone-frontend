import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CImage,
  CBadge,
  CButton,
} from '@coreui/react'
import { BASE_URL } from '../../../constants/api'
import TextInfoRow from '../../_fragments/FORMInfoRow'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import NumberInfoRow from '../../_fragments/FORMNumberInfoRow'

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
      <DisplayLoading message={"Loading Host Details..."}/>
    )
  }

  if (error) {
    return (
      <DisplayError error={error} />
    )
  }

  return (
    <CContainer className="pb-3">
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
            <CCardHeader className="text-center p-4">
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
                className="py-2 mt-2 rounded-pill"
                style={{ width: '90px' }}
              >
                {host.status}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <TextInfoRow label="Full Name" value={host.fullName} />
              <TextInfoRow label="Phone number" value={host.phone} />
              <TextInfoRow label="Address" value={host.address} />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} sm={12} md={12} lg={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4 bg-secondary text-white">
              <h3>Host Statistics</h3>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <NumberInfoRow
                label="Houses Listed"
                value={host.housesForRent ? host.housesForRent : '0'}
              />
              <NumberInfoRow
                label="Total Income"
                value={<CurrencyFormat value={host.totalIncome} />}
              />
              <div className="d-flex align-items-center fw-bold">
                Danh sách nhà
                <CButton
                  size="sm"
                  className="ms-2 border highlight-btn"
                  color="light"
                  onClick={() => navigate(`/admin/hosts/${host.id}/houses`, {state: {username: host.username,}})}
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default HostDetail
