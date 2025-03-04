import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow,
  CTable, CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow, CTooltip,
} from '@coreui/react'
import styles from '../css/HouseList.module.css'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import { UserPagination } from '../../_fragments/CustomerPagination'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createMaintenanceRecord,
  getBookedDates,
  getHouseList,
  getLatestAvailableDate,
  searchHouses,
  updateHouseStatus,
} from '../../../redux/slices/houseSlice'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import { HiOutlineSearch } from 'react-icons/hi'
import { TbEdit } from 'react-icons/tb'
import { useLocation } from 'react-router-dom'

const HouseListTable = () => {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const dispatch = useDispatch()
  const location = useLocation()

  const { username } = location.state

  const [houseName, setHouseName] = useState('')
  const [status, setStatus] = useState('')

  const [selectedHouse, setSelectedHouse] = useState({})
  const [newStatus, setNewStatus] = useState('')

  const today = dayjs().toDate()
  const [modalVisible, setModalVisible] = useState(false)
  const [bookedDates, setBookedDates] = useState([])
  const [maxAvailableDate, setMaxAvailableDate] = useState(today.getFullYear() + 10)
  const [minAvailableDate, setMinAvailableDate] = useState(today)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)


  useEffect(() => {
    document.title = 'Airbnb | House List'
  }, [])

  useEffect(() => {
    dispatch(getHouseList({ username, page, size }))
  }, [dispatch, page, size, username])

  const handleSearch = () => {
    dispatch(searchHouses({ username, houseName, status, page, size }))
  }

  const handleUpdateStatus = async (house) => {
    if (house.status === 'RENTED') {
      toast.warning('Cannot change status of the house being rented!')
      return
    }
    setSelectedHouse(house)
    setNewStatus(house.status)
    setModalVisible(true)
    const houseId = house.id
    try {
      const response = await dispatch(getBookedDates({ houseId })).unwrap()
      console.log(response)
      if (response.length > 0) {
        const bookedDatesList = response.map(bookingDTO => ({
          start: dayjs(new Date(bookingDTO.startDate)).subtract(1, 'day').toDate(),
          end: new Date(bookingDTO.endDate),
        }))
        let newMinDate = new Date() // Lấy ngày hiện tại
        for (let i = 0; i < bookedDatesList.length; i++) {
          if (bookedDatesList[i].start <= newMinDate && newMinDate <= bookedDatesList[i].end) {
            // Nếu hôm nay nằm trong khoảng đặt chỗ, tìm ngày có thể đặt tiếp theo
            newMinDate = dayjs(bookedDatesList[i].end).add(1, 'day').toDate()
            break
          }
        }
        console.log(newMinDate)
        console.log(bookedDatesList)

        setMinAvailableDate(newMinDate)
        setStartDate(newMinDate)
        setEndDate(newMinDate)
        setBookedDates(bookedDatesList)
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error)
      toast.error('Failed to fetch booked dates')
    }

    try {
      const response = await dispatch(getLatestAvailableDate({ houseId, startDate })).unwrap()
      setMaxAvailableDate(dayjs(response).toDate())
    } catch (error) {
      console.error('Error fetching booked dates:', error)
      toast.error('Failed to fetch booked dates')
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setNewStatus('')
    setStartDate(today)
    setEndDate(today)
    setBookedDates([])
  }

  const handleSubmitUpdate = async () => {
    if (!newStatus) {
      toast.warning('Please select a status!')
      return
    }

    if (newStatus === selectedHouse.status) {
      handleCloseModal()
      return
    }

    if (newStatus === 'MAINTAINING' && (!startDate || !endDate)) {
      toast.warning('Please select a valid date range for maintenance!')
      return
    }

    let previousStatus = selectedHouse.status

    try {
      // Cập nhật trạng thái nhà trước
      const response = await dispatch(updateHouseStatus({ houseId: selectedHouse.id, status: newStatus })).unwrap()
      console.log(response)
      toast.success('House status updated successfully!')

      const formattedStartDate = startDate.toISOString().split('T')[0]
      const formattedEndDate = endDate.toISOString().split('T')[0]

      // Nếu trạng thái được cập nhật thành MAINTAINING, mới tạo maintenance record
      if (newStatus === 'MAINTAINING') {
        try {
          const maintenanceResponse = await dispatch(
            createMaintenanceRecord({
              houseId: selectedHouse.id,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            }),
          ).unwrap()
          console.log(maintenanceResponse)
          toast.success('Maintenance record created successfully!')
        } catch (error) {
          // Nếu tạo maintenance record thất bại, rollback trạng thái nhà về trạng thái cũ
          toast.error('Failed to create maintenance record. Rolling back status...')
          await dispatch(updateHouseStatus({ houseId: selectedHouse.id, status: previousStatus })).unwrap()
        }
      }

      // Đóng modal & cập nhật danh sách
      handleCloseModal()
      await dispatch(getHouseList({ username, page, size }))
    } catch (error) {
      toast.error('Failed to update house status or create maintenance record!')
    }
  }

  const { houseList, totalPages, loading, error } = useSelector((state) => state.houses);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'MAINTAINING':
        return 'warning'
      case 'AVAILABLE':
        return 'success'
      case 'RENTED':
        return 'primary'
      default:
        return 'dark'
    }
  }

  if (loading.houseList || !houseList) return (
    <DisplayLoading message={"Loading Houses..."} />
  )
  if (error.houseList) return (
    <DisplayError error={error} />
  )

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol sm={12} md={8} lg={4} className="mt-2">
          <div className="d-flex flex-column flex-grow-1">
            <label className="fw-bolder ps-1">Address</label>
            <CFormInput
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              className="ps-2 pt-2"
              placeholder="Enter house name"
            />
          </div>
        </CCol>
        <CCol sm={8} md={2} lg={2} className="mt-2">
          <div className="d-flex flex-column flex-grow-1">
            <label className="fw-bolder ps-1">Status</label>
            <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Choose Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="RENTED">RENTED</option>
              <option value="MAINTAINING">CANCELED</option>
            </CFormSelect>
          </div>
        </CCol>
        <CCol sm={4} md={2} lg={1} className="text-center mt-2">
          <div style={{ minHeight: '24px' }}></div>
          <CButton
            color="primary"
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ height: '37.6px', width: '37.6px', padding: '0' }}
            onClick={handleSearch}
          >
            <HiOutlineSearch style={{ width: '20px', height: '20px' }} />
          </CButton>
        </CCol>
      </CRow>
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="my-3">House List</h4>
            </CCardHeader>
            <CCardBody>
              {!houseList || houseList.length === 0 ? (
                <div className="text-center py-4">
                  <h2>No bookings found.</h2>
                </div>
              ) : (
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">House Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Address</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Rentals Count</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Daily Rent</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Revenue</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {houseList.map((house) => (
                      <CTableRow key={house.id} className="align-middle">
                        <CTableDataCell className={styles['house-name']} title={house.houseName}>
                          <CTooltip content={house.houseName}>
                            <span>{house.houseName}</span>
                          </CTooltip>
                        </CTableDataCell>
                        <CTableDataCell>{house.address}</CTableDataCell>
                        <CTableDataCell className="text-end">{house.rentals}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={house.price} />
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CurrencyFormat value={house.totalRevenue} />
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge
                            color={getStatusBadgeColor(house.status)}
                            className="p-2 fw-normal rounded-pill"
                          >
                            {house.status.replace('_', ' ')}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="d-flex justify-content-center">
                          <CTooltip content={'Change house status'}>
                            <CButton
                              color="light"
                              onClick={() => handleUpdateStatus(house)}
                              className={styles['update-house-btn']}
                            >
                              <TbEdit style={{ width: '20px', height: '20px' }} />
                            </CButton>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
              {houseList && houseList.length > 0
                && <UserPagination page={page} totalPages={totalPages} setPage={setPage} />
              }
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal visible={modalVisible} onClose={handleCloseModal}>
        <CModalHeader>Update House Status</CModalHeader>
        <CModalBody>
          <CRow>
            <CCol sm={12} md={5} lg={5} className="d-flex flex-column flex-grow-1">
              <label className="fw-bolder ps-1">Status</label>
              <CFormSelect
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-control border-1 text-center bring-front"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="MAINTAINING">MAINTAINING</option>
              </CFormSelect>
            </CCol>
            <CCol sm={12} md={7} lg={7} className="d-flex flex-column flex-grow-1">
              {newStatus === 'MAINTAINING' &&
                <div>
                  <label className="fw-bolder ps-1">Date Range</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                      const [start, end] = dates
                      setStartDate(start)
                      setEndDate(end)
                    }}
                    className="form-control border-1 text-center bring-front"
                    startDate={startDate}
                    endDate={endDate}
                    minDate={minAvailableDate}
                    maxDate={maxAvailableDate || undefined}
                    dateFormat="dd/MM/yyyy"
                    excludeDateIntervals={bookedDates}
                    selectsRange
                  />
                </div>
              }
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={handleSubmitUpdate}
          >
            Confirm
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  )
}

export default HouseListTable