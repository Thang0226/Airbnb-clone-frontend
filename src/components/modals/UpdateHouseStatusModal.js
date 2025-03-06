import { CButton, CCol, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react'
import DatePicker from 'react-datepicker'
import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  createMaintenanceRecord,
  getBookedDates,
  getLatestAvailableDate, getMaintenanceRecords,
  updateHouseStatus,
} from '../../redux/slices/houseSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

const UpdateHouseStatusModal = ({ visible, onClose, selectedHouse, newStatus, setNewStatus, refresh }) => {
  const dispatch = useDispatch()

  const today = dayjs().toDate()
  const [occupiedDates, setOccupiedDates] = useState([])
  const [maxAvailableDate, setMaxAvailableDate] = useState(null)
  const [minAvailableDate, setMinAvailableDate] = useState(today)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const fetchDates = useCallback(async () => {
    if (!selectedHouse?.id) return

    const houseId = selectedHouse.id
    let newMinDate = new Date()

    try {
      const bookedResponse = await dispatch(getBookedDates({ houseId })).unwrap()
      const bookedDatesList = bookedResponse.length > 0 ? bookedResponse.map(bookingDTO => ({
        start: dayjs(new Date(bookingDTO.startDate)).subtract(1, 'day').toDate(),
        end: new Date(bookingDTO.endDate),
      })) : []

      const maintenanceResponse = await dispatch(getMaintenanceRecords({ houseId })).unwrap()
      const maintenanceList = maintenanceResponse.length > 0 ? maintenanceResponse.map(record => ({
        start: dayjs(new Date(record.startDate)).subtract(1, 'day').toDate(),
        end: new Date(record.endDate),
      })) : []

      const allOccupiedDates = [...bookedDatesList, ...maintenanceList]

      if (allOccupiedDates.length > 0) {
        for (let i = 0; i < allOccupiedDates.length; i++) {
          if (allOccupiedDates[i].start <= newMinDate && newMinDate <= allOccupiedDates[i].end) {
            newMinDate = dayjs(allOccupiedDates[i].end).add(1, 'day').toDate()
            break
          }
        }
      }


      setOccupiedDates(allOccupiedDates)

    } catch (error) {
      console.error('Error fetching booked or maintenance dates:', error)
      toast.error('Failed to fetch occupied dates')
    }

    try {
      const response = await dispatch(getLatestAvailableDate({ houseId })).unwrap()
      console.log(response)
      setMaxAvailableDate(response)
    } catch (error) {
      console.log('Error fetching latest available date:', error)
      toast.error('Failed to fetch latest available date')
    }

    return newMinDate;
  }, [dispatch, selectedHouse?.id])

  useEffect(() => {
    fetchDates().then((newMinDate) => {
      setMinAvailableDate(newMinDate)
      setStartDate(newMinDate);
      setEndDate(newMinDate);
    })
  }, [visible, fetchDates]) // Chỉ chạy khi modal mở

  const handleSubmitUpdate = async () => {
    if (!newStatus) {
      toast.warning('Please select a status!')
      return
    }

    if (newStatus === selectedHouse.status) {
      onClose()
      return
    }

    if (newStatus === 'MAINTAINING' && (!startDate || !endDate)) {
      toast.warning('Please select a valid date range for maintenance!')
      return
    }

    let previousStatus = selectedHouse.status

    try {
      // Cập nhật trạng thái nhà trước
      await dispatch(updateHouseStatus({ houseId: selectedHouse.id, status: newStatus })).unwrap()
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
      onClose()
      refresh()
    } catch (error) {
      toast.error('Failed to update house status or create maintenance record!')
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
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
                  onChange={async (dates) => {
                    const [start, end] = dates
                    setStartDate(start)
                    setEndDate(end)
                    if (start) {
                      try {
                        const response = await dispatch(getLatestAvailableDate({
                          houseId: selectedHouse.id, date: start,
                        }))
                          .unwrap()
                        console.log('Latest available date:', dayjs(response).toDate())
                        setMinAvailableDate(start)
                        setOccupiedDates((prevDates) => [
                          ...prevDates,
                          {
                            start: dayjs(response).add(1, 'day').toDate(),
                            end: new Date(2100, 12, 31),
                          }])
                      } catch (error) {
                        console.log('Error fetching latest available date:', error)
                        toast.error('Failed to fetch latest available date')
                      }
                    }
                  }}
                  onCalendarClose={async () => {
                    const newMinDate = await fetchDates()
                    setMinAvailableDate(newMinDate)
                  }}
                  className="form-control border-1 text-center bring-front"
                  startDate={startDate}
                  endDate={endDate}
                  minDate={minAvailableDate}
                  maxDate={maxAvailableDate || undefined}
                  dateFormat="dd/MM/yyyy"
                  excludeDateIntervals={occupiedDates}
                  selectsRange
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={50}
                  scrollableYearDropdown
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
  )
}

export default UpdateHouseStatusModal