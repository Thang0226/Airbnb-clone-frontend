import React, { useEffect, useState } from 'react'
import { DisplayLoading } from '../../DisplayLoading'
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
  CTableRow,
} from '@coreui/react'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import axiosInstance from '../../../services/axiosConfig'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import ReviewWindow from './review/ReviewWindow'
import { useSelector } from 'react-redux'

const UserBookingList = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [bookingInfo, setBookingInfo] = useState({});

  const now = new Date();
  const username = useSelector(state => state.account.username)

  const isOneDayBeforeStartDate = (startDate) => {
    let startTime = dayjs(startDate).hour(12).minute(0).second(0).toDate();
    let timeDifference = (startTime - now) / (1000 * 60 * 60);
    return timeDifference >= 24;
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'WAITING':
        return 'success';
      case 'CANCELED':
        return 'secondary';
      case 'CHECKED_IN':
        return 'primary';
      case 'CHECKED_OUT':
        return 'secondary';
      default:
        return 'dark';
    }
  };

  useEffect(() => {
    document.title = 'Airbnb | User Booking History';
    axiosInstance.get(`/bookings/user/${username}`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {console.log(err)});
  }, [username])

  const handleCancelBooking = (bookingId) => {
    axiosInstance.post(`/bookings/${bookingId}/cancel`, username, {
      headers: {
        'Content-Type': 'text/plain',
      }
    })
      .then(res => {
        toast.info("Booking canceled");
        setBookings(res.data);
      })
      .catch(err => {console.log(err)});
  }

  const getBookingInfo = async (bookingId) => {
    return await axiosInstance.get(`/bookings/${bookingId}/get`)
  }

  const handleReviewBooking = async (bookingId) => {
    const res = await getBookingInfo(bookingId);
    const bookingInfo = res.data;
    setBookingInfo(bookingInfo);
    setReviewVisible(true);
  }

  const handleFinishReview = async (rating, comment) => {
    await axiosInstance.post(`/bookings/${bookingInfo.id}/review`, {
      rating: rating,
      comment: comment
    }).then((res) => {
      toast.success(res.data);
      setReviewVisible(false);
    }).catch((err) => {
      console.log(err);
    })
  }

  if (loading || !bookings) return (
    <DisplayLoading message={"Loading Bookings..."}/>
  )

  return (
    <div className="container">
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="my-3 text-center">Your Bookings</h4>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>House Name</CTableHeaderCell>
                    <CTableHeaderCell>Address</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Start Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">End Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Total Cost</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {bookings.map((booking) => (
                    <CTableRow key={booking.id} className='align-middle'>
                      <CTableDataCell
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={booking.houseName}
                      >
                        {booking.houseName}
                      </CTableDataCell>
                      <CTableDataCell>{booking.address}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(booking.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(booking.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CurrencyFormat value={booking.totalCost} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge
                          color={getStatusBadgeColor(booking.bookingStatus)}
                          className="p-2 rounded-pill"
                        >
                          {booking.bookingStatus.replace('_', ' ')}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {(isOneDayBeforeStartDate(booking.startDate)) && (
                          <CButton
                          size="sm"
                          color={"warning"}
                          className="text-white"
                          style={{ width: "90px" }}
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </CButton>)}
                        {(booking.bookingStatus === 'CHECKED_OUT') && (
                          <CButton
                            size="sm"
                            color="info"
                            className="text-white"
                            style={{ width: "90px" }}
                            onClick={() => handleReviewBooking(booking.id)}
                          >
                            Review
                          </CButton>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ReviewWindow
        visible={reviewVisible}
        setVisible={setReviewVisible}
        bookingInfo={bookingInfo}
        handleAfterConfirm={(rating, comment) => handleFinishReview(rating, comment)}
      />
    </div>
  )
}
export default UserBookingList;