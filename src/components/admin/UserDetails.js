import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { BASE_URL } from '../../constants/api'
import UserInfoRow from '../_fragments/FORMInfoRow'
import { getUserDetails, getUserRentalHistory, getUserTotalPayment } from '../../redux/slices/userDetailsSlice'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'

const UserDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userID } = useParams()

  useEffect(() => {
    document.title = 'Airbnb | User Details'
  }, [])

  useEffect(() => {
    dispatch(getUserDetails(userID))
  }, [dispatch, userID])


  useEffect(() => {
    dispatch(getUserRentalHistory(userID))
  }, [dispatch, userID])

  useEffect(() => {
    dispatch(getUserTotalPayment(userID))
  }, [dispatch, userID])


  const { userDetails, userRentalHistory, userTotalPayment, error, loading } = useSelector((state) => state.userDetails)


  if (loading || !userDetails) return (
    <DisplayLoading />
  )
  if (error) return (
    <DisplayError error={error} />
  )


  return (
    <div>
      <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate(-2)}
        >
          Dashboard
        </span>
        <span className="mx-1">{'/'}</span>
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate(-1)}
        >
          User List
        </span>
        <span className="mx-1">{'/'}</span>
        <span>User Details</span>
      </div>
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="justify-content-center mt-4"
      >
        <CCol xs={12} sm={12} md={12} lg={6}>
        <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4">
              <img
                src={
                  userDetails.avatar
                    ? `${BASE_URL}/images/${userDetails.avatar}`
                    : `${BASE_URL}/images/default.jpg`
                }
                alt={userDetails.username}
                className="rounded-circle border border-blue border-4"
                width="150"
                height="150"
                style={{ objectFit: 'cover' }}
              />
              <h3 className="mt-3">{userDetails.username}</h3>
              <CBadge
                color={userDetails.status === 'ACTIVE' ? 'success' : 'secondary'}
                className="py-2"
                style={{ width: '90px' }}
              >
                {userDetails.status}
              </CBadge>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <UserInfoRow label="Full Name" value={userDetails.fullName} />
              <UserInfoRow label="Phone" value={userDetails.phone} />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12} sm={12} md={12} lg={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4">
              <h2>User's Statistic</h2>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <UserInfoRow label="House Rented" value={userRentalHistory?.length || '0'} />
              <UserInfoRow label="Total Rental Paid" value={<CurrencyFormat value={userTotalPayment} />} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="mt-5"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="my-3">🏡 User Rental History 🏡</h4>
            </CCardHeader>
            <CCardBody>
              {userRentalHistory && userRentalHistory.length > 0 ? (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>House Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Daily Rent</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Start Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">End Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Day(s) Stayed</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Money paid</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {userRentalHistory.map((house) => (
                      <CTableRow key={house.id}>
                        <CTableDataCell>{house.houseName}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={house.rentalPrice} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(house.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(house.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{house.rentalDay}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={house.rentPaid} />
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              ) : (
                <div className="text-center">
                  <h1 className="m-0">There are no houses rented by this user.</h1>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default UserDetails