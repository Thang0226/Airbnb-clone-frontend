import React, { useEffect, useState } from 'react'
import { DisplayLoading } from '../DisplayLoading'
import {
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
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import axiosInstance from '../../services/axiosConfig'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const UserBookingList = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const now = new Date();
  const username = localStorage.getItem("username")

  const isOneDayBeforeStartDate = (startDate) => {
    let startTime = dayjs(startDate).hour(12).minute(0).second(0).toDate();
    let timeDifference = (startTime - now) / (1000 * 60 * 60);
    return timeDifference >= 24;
  }

  useEffect(() => {
    document.title = 'Airbnb | User Booking History';
    axiosInstance.get(`/bookings/user/${username}`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {console.log(err)});
  }, [])

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

  if (loading || !bookings) return (
    <DisplayLoading/>
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
                        {booking.bookingStatus.replace("_", " ")}
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
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}
export default UserBookingList;