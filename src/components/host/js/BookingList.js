import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable, CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow, CTooltip,
} from '@coreui/react'
import { UserPagination } from '../../_fragments/CustomerPagination'
import { getBookings, processBooking, searchBookings } from '../../../redux/slices/bookingSlice'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import styles from '../css/HouseList.module.css'
import BookingSearchBar from './BookingSearchBar'
import { HiOutlineArrowRightEndOnRectangle, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { CheckInAndCheckOut } from '../../modals/CheckInAndCheckOut'
import { toast } from 'react-toastify'

const BookingList = () => {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const dispatch = useDispatch()
  const username = useSelector(state => state.account.username)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [action, setAction] = useState('')

  const [searchData, setSearchData] = useState({
    houseName: '',
    startDate: '',
    endDate: '',
    status: '',
  })

  useEffect(() => {
    document.title = 'Host | Booking List'
  }, [])

  useEffect(() => {
    dispatch(getBookings({ username, page, size }))
  }, [dispatch, page, size, username])

  const handleSearch = (newSearchData) => {
    setSearchData(newSearchData)  // Cập nhật state để không bị mất dữ liệu
    dispatch(searchBookings({ username, searchData: newSearchData, page, size }))
  }

  const { bookings, error, loading, totalPages } = useSelector((state) => state.booking)

  const handleBooking = (booking, action) => {
    setSelectedBooking(booking)
    setAction(action)
    setModalVisible(true)
  }

  const handleConfirm = () => {
    const bookingId = selectedBooking.id
    const formatedAction = action.replace('-',"")

    dispatch(processBooking({bookingID: bookingId, action: formatedAction}))
      .then(() => {
        toast.success(
          <div>
            Successfully {action} for <strong>{selectedBooking.houseName}</strong>!
          </div>
        )
      })
      .catch((error) => {
        toast.error('Error processing booking:', error)
      })
      .finally(() => {
        dispatch(getBookings({ username, page, size }))
        setModalVisible(false)
      })

  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'WAITING':
        return 'success'
      case 'CANCELED':
        return 'secondary'
      case 'CHECKED_IN':
        return 'primary'
      case 'CHECKED_OUT':
        return 'secondary'
      default:
        return 'dark'
    }
  }

  if (loading || !bookings) return (
    <DisplayLoading />
  )
  if (error) return (
    <DisplayError error={error} />
  )

  return (

    <div className="container">
      <BookingSearchBar onSearch={handleSearch} searchData={searchData} />
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
                      <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {bookings.map((booking) => (
                      <CTableRow key={booking.id} className="align-middle">
                        <CTableDataCell className={styles['house-name']} title={booking.houseName}>
                          <CTooltip content={booking.houseName}>
                            <span>{booking.houseName}</span>
                          </CTooltip>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(booking.startDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {new Date(booking.endDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{booking.rentalDay}</CTableDataCell>
                        <CTableDataCell>{booking.customerName}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={booking.totalCost} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge
                            color={getStatusBadgeColor(booking.status)}
                            className="p-2 rounded-pill"
                          >
                            {booking.status.replace('_', ' ')}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <div className="d-flex justify-content-center">
                            {booking.status === 'WAITING' &&
                              <CTooltip content="Check-in">
                                <CButton
                                  size="md"
                                  color="primary"
                                  className="text-white d-flex align-items-center justify-content-center"
                                  style={{ width: '40px', height: '40px', flexShrink: 0 }}
                                  onClick={() => handleBooking(booking, "check-in")}
                                >
                                  <HiOutlineArrowRightEndOnRectangle
                                    style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                                </CButton>
                              </CTooltip>
                            }
                            {booking.status === 'CHECKED_IN' &&
                              <CTooltip content="Check-out">
                                <CButton
                                  size="md"
                                  color="secondary"
                                  className="text-white d-flex align-items-center justify-content-center"
                                  style={{ width: '40px', height: '40px', flexShrink: 0 }}
                                  onClick={() => handleBooking(booking, "check-out")}

                                >
                                  <HiOutlineArrowRightOnRectangle
                                    style={{ width: '24px', height: '24px', flexShrink: 0 }} />
                                </CButton>
                              </CTooltip>
                            }
                            <CheckInAndCheckOut
                              visible={modalVisible}
                              onClose={() => setModalVisible(false)}
                              onConfirm={handleConfirm}
                              booking={selectedBooking}
                              action={action}
                            />
                          </div>
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