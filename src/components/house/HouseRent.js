import { useSelector } from 'react-redux'
import {
  CButton, CCard, CCardBody,
  CCardText,
  CCol,
  CContainer,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import axiosInstance from '../../services/axiosConfig';
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import DatePicker from "react-datepicker"

export default function HouseRent() {
  const selectedHouse = useSelector(state => state.houses.house)
  const [checkIn, setCheckIn] = useState(dayjs().toDate())
  const [checkOut, setCheckOut] = useState(dayjs().add(1, "day").toDate())
  const [totalDays, setTotalDays] = useState(1)
  const [totalCost, setTotalCost] = useState(selectedHouse.price)

  const disabledDates = [].map(date => new Date(date)) // NOT RIGHT YET!

  useEffect(() => {
    let totalDays = dayjs(checkOut).diff(checkIn, 'day');
    if (totalDays <= 0) {
      totalDays = 0;
    }
    setTotalDays(totalDays);
    let totalCost = selectedHouse.price * totalDays
    setTotalCost(totalCost)
  }, [checkIn, checkOut, selectedHouse])

  const getNextDisabledDate = (date) => {
    return disabledDates.find(disabledDate => disabledDate > date); // NOT RIGHT YET!
  };

  const handleRentHouse = async () => {
    try {
      const response = await axiosInstance.post('/houses/rent-house', {
        houseId: selectedHouse.id,
        userId: localStorage.getItem('userId'),
        startDate: dayjs(checkIn).format('YYYY-MM-DD'),
        endDate: dayjs(checkOut).format('YYYY-MM-DD'),
        price: totalCost,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <CContainer fluid className="bg-light px-4 pb-1 rounded-4 shadow-sm">
      <CRow className="g-3 align-items-center mb-1">
        {/* Check-In Date */}
        <CCol sm={12} md={4}>
          <div className="position-relative border-start">
            <CInputGroup className="border-0">
              <CInputGroupText className="bg-transparent border-0">
                <Calendar className="text-primary" size={30} />
              </CInputGroupText>
              <div className="d-flex flex-column flex-grow-1">
                <label className="fw-bolder">Check-In</label>
                <DatePicker
                  selected={new Date(checkIn)}
                  onChange={(date) => {setCheckIn(date); setCheckOut(null)}}
                  className="form-control border-0"
                  minDate={new Date()} // Disable past dates
                  excludeDates={disabledDates} // Disable specific dates
                  placeholderText="Check-In Date"
                 showMonthYearDropdown/>
              </div>
            </CInputGroup>
          </div>
        </CCol>
        {/* Check-Out Date */}
        <CCol sm={12} md={4}>
          <div className="position-relative border-start">
            <CInputGroup className="border-0">
              <CInputGroupText className="bg-transparent border-0">
                <Calendar className="text-primary" size={30} />
              </CInputGroupText>
              <div className="d-flex flex-column flex-grow-1">
                <label className="fw-bolder">Check-Out</label>
                <DatePicker
                  selected={new Date(checkOut)}
                  onChange={(date) => setCheckOut(date)}
                  className="form-control border-0"
                  minDate={checkIn ? dayjs(checkIn).toDate() : null}
                  maxDate={checkIn ? dayjs(getNextDisabledDate(checkIn)).subtract(1, "day").toDate() : null}
                  excludeDates={disabledDates} // Disable specific dates
                  placeholderText="Check-Out Date"
                 showMonthYearDropdown/>
              </div>
            </CInputGroup>
          </div>
        </CCol>
        <CCol sm={12} md={4}>
          <CCard className="mb-3">
            <CCardBody>
              <CCardText>
                <strong>${totalDays} Days</strong>
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="g-3 align-items-center mb-1">
        <CCol sm={12} md={8}>
          <CCard className="mb-3">
            <CCardBody>
              <CCardText>
                Total Cost: <strong>${totalCost}</strong> VND
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={12} md={4} className="pt-4 justify-content-center">
          <CButton
            color="primary"
            className="w-100"
            onClick={handleRentHouse}
          >
            Rent
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}