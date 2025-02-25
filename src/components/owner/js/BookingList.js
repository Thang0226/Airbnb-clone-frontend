import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
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
import { UserPagination } from '../../_fragments/CustomerPagination'
import { getBookings } from '../../../redux/slices/bookingSlice'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import styles from '../css/HoustList.module.css';

const BookingList = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = localStorage.getItem("username")

  useEffect(() => {
    document.title = 'Airbnb | Booking List';
  }, [])

  useEffect(() => {
    dispatch(getBookings({username, page, size}));
  }, [dispatch,page,size, username]);

  const { bookings, error, loading, totalPages } = useSelector((state) => state.booking);


  if (loading || !bookings) return (
    <DisplayLoading/>
  )
  if (error) return (
    <DisplayError error={error} />
  )

  return (
    <div className="container">
      <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </span>
        <span className="mx-1">{'/'}</span>
        <span>User List</span>
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
                    <CTableRow key={booking.id} className='align-middle'>
                      <CTableDataCell
                        className={styles["house-name"]}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={booking.houseName}
                      >
                        {booking.houseName}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(booking.startDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {new Date(booking.endDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">{booking.rentalDay}</CTableDataCell>
                      <CTableDataCell>{booking.customerName}</CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CurrencyFormat value={booking.totalCost} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center"> {booking.status.replace("_", " ")}</CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                      >
                        <CButton
                          size="sm"
                          color={"success"}
                          className="text-white"
                          style={{ width: "90px" }}
                          // onClick={() =>}
                        >
                          Check In
                        </CButton>
                        <CButton
                          size="sm"
                          color="primary"
                          className="text-white ms-2"
                          style={{ width: "90px" }}
                          // onClick={() => }
                        >
                          Check Out
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <UserPagination page={page} totalPages={totalPages} setPage={setPage} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}
export default BookingList