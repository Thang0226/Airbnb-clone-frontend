import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CFormInput, CFormSelect,
  CRow,
  CTable, CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { UserPagination } from '../../_fragments/CustomerPagination'
import { getBookings, searchBookings } from '../../../redux/slices/bookingSlice'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import styles from '../css/HoustList.module.css'

const BookingList = () => {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const dispatch = useDispatch()

  const [houseName, setHouseName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('')

  const username = localStorage.getItem('username')

  useEffect(() => {
    document.title = 'Airbnb | Booking List'
  }, [])

  useEffect(() => {
    dispatch(getBookings({ username, page, size }))
  }, [dispatch, page, size, username])

  const handleSearch = () => {
    const searchData = {
      houseName: houseName,
      startDate: startDate,
      endDate: endDate,
      status: status
    }
    dispatch(searchBookings({username, searchData, page, size}))
  }

  const { bookings, error, loading, totalPages } = useSelector((state) => state.booking)

  if (loading || !bookings) return (
    <DisplayLoading />
  )
  if (error) return (
    <DisplayError error={error} />
  )

  return (

    <div className="container">
      <div>
        <CRow className="justify-content-center">
          <CCol sm={12} md={8} lg={3} className="mt-2">
            <div className="d-flex flex-column flex-grow-1">
              <label className="fw-bolder ps-2">Address</label>
              <CFormInput
                type="text"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className="ps-2 pt-2"
                placeholder="Enter house name"
              />
            </div>
          </CCol>
          <CCol sm={12} md={4} lg={2} className="mt-2">
            <div className="d-flex flex-column flex-grow-1">
              <label className="fw-bolder ps-2">Status</label>
              <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Chose Status</option>
                <option key="WAITING" value="WAITING">WAITING</option>
                <option key="CHECKED_IN" value="CHECKED_IN">CHECKED IN</option>
                <option key="CHECKED_OUT" value="CHECKED_OUT">CHECKED OUT</option>
                <option key="CANCELED" value="CANCELED">CANCELED</option>
              </CFormSelect>
            </div>
          </CCol>
          <CCol sm={12} md={5} lg={3} className="mt-2">
            <div className="d-flex flex-column flex-grow-1">
              <label className="fw-bolder ps-2">Start Date</label>
              <CFormInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="ps-2 pt-2"
              />
            </div>
          </CCol>
          <CCol sm={12} md={5} lg={3} className="mt-2">
            <div className="d-flex flex-column flex-grow-1">
              <label className="fw-bolder ps-2">End Date</label>
              <CFormInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ps-2 pt-2"
              />
            </div>
          </CCol>
          <CCol sm={12} md={2} lg={1} className="text-center mt-2">
            <div style={{minHeight: "24px"}}></div>
            <CButton
              color="primary"
              className="w-100"
              onClick={handleSearch}
            >
              Search
            </CButton>
          </CCol>
        </CRow>
      </div>
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="my-3">Booking List</h4>
            </CCardHeader>
            <CCardBody>
              {!bookings || bookings.length === 0 ? (
                <div className="text-center py-4">
                  <h2>No bookings found.</h2>
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>House Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Start Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">End Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Rental Days</CTableHeaderCell>
                      <CTableHeaderCell>Customer Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Total cost</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {bookings.map((booking) => (
                      <CTableRow key={booking.id} className="align-middle">
                        <CTableDataCell className={styles['house-name']} title={booking.houseName}>
                          {booking.houseName}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(booking.startDate).toLocaleDateString('vi-VN')}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(booking.endDate).toLocaleDateString('vi-VN')}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{booking.rentalDay}</CTableDataCell>
                        <CTableDataCell>{booking.customerName}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={booking.totalCost} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{booking.status.replace('_', ' ')}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton size="sm" color="success" className="text-white" style={{ width: '90px' }}>
                            Check In
                          </CButton>
                          <CButton size="sm" color="primary" className="text-white ms-2" style={{ width: '90px' }}>
                            Check Out
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
              {bookings && bookings.length > 0 &&
                <UserPagination page={page} totalPages={totalPages} setPage={setPage} />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}
export default BookingList