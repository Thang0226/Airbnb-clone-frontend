import { useSelector } from 'react-redux'
import {
  CButton, CCard, CCardBody,
  CCardText,
  CCol,
  CContainer,
  CInputGroup,
  CRow,
} from '@coreui/react'
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from '../../services/axiosConfig';
import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import dayjs from 'dayjs'
import DatePicker from "react-datepicker"
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BASE_URL_HOUSE } from '../../constants/api'
import { setHouse } from '../../redux/slices/houseSlice'

export default function HouseRent({houseId}) {
  const dispatch = useDispatch()
  const selectedHouse = useSelector(state => state.houses.house)
  const [checkIn, setCheckIn] = useState(dayjs().toDate())
  const [checkOut, setCheckOut] = useState(dayjs().toDate())
  const [totalDays, setTotalDays] = useState(1)
  const [totalCost, setTotalCost] = useState(selectedHouse.price)

  const disabledDates = ["2025-02-26", "2025-02-27"].map(date => new Date(date)) // NOT RIGHT YET!
  // const disabledDates = [
  //   {start: new Date("2025-02-26"), end: new Date("2025-02-27")},
  //   {start: new Date("2025-02-26"), end: new Date("2025-02-27")},
  // ]

  useEffect(() => {
    console.log(selectedHouse)
    let totalDays = Math.round((checkOut - checkIn) / (60 * 60 * 24 * 1000))
    if (totalDays <= 0) {
      totalDays = 0
    }
    setTotalDays(totalDays)
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
      toast.success(response.data);
      const houseUpdated = await axios.get(`${BASE_URL_HOUSE}/${houseId}`);
      dispatch(setHouse(houseUpdated.data));
    } catch (error) {
      toast.error(error.response.data);
      console.log(error.response.data);
    }
  }

  return (
    <CContainer className="bg-light px-4 rounded-4 shadow-sm py-1">
          <CRow className="align-items-center my-3">
            {/* Check-In Date */}
            <CCol sm={12} md={4}>
                <CInputGroup className="border-0">
                    <label className="fw-bolder fs-6">Check-In</label>
                    <DatePicker
                      selected={new Date(checkIn)}
                      onChange={(date) => {setCheckIn(date); setCheckOut(date)}}
                      className="form-control border-0 text-center"
                      minDate={new Date()} // Disable past dates
                      excludeDates={disabledDates} // Disable specific dates
                      placeholderText="Check-In Date"
                    />
                </CInputGroup>
            </CCol>
            {/* Check-Out Date */}
            <CCol sm={12} md={4}>
                <CInputGroup className="border-0">
                    <label className="fw-bolder fs-6">Check-Out</label>
                    <DatePicker
                      selected={new Date(checkOut)}
                      onChange={(date) => setCheckOut(date)}
                      className="form-control border-0 text-center"
                      minDate={checkIn ? checkIn : null}
                      maxDate={checkIn ? dayjs(getNextDisabledDate(checkIn)).subtract(1, "day").toDate() : null}
                      excludeDates={disabledDates} // Disable specific dates
                      placeholderText="Check-Out Date"
                     />
                </CInputGroup>
            </CCol>
            <CCol sm={12} md={4}>
              <CInputGroup className="border-0">
                <label className="fw-bolder fs-6">Days count</label>
                <CCard className="border-0 w-50">
                  <CCardBody className="d-flex p-1 ps-2 rounded justify-content-center" style={{height: "35px"}}>
                    {totalDays}
                  </CCardBody>
                </CCard>
              </CInputGroup>
            </CCol>
          </CRow>

      <CRow className="align-items-center mb-1">
        <CCol sm={12} md={7} className="">
          <label className="fw-bolder fs-6">Total Cost</label>
          <div className="d-flex justify-content-end">
            <CCard className="mb-2 w-100">
              <CCardBody className="d-flex p-2 justify-content-end">
                <CCardText>
                  <strong><CurrencyFormat value={totalCost} /></strong>
                </CCardText>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
        <CCol sm={12} md={5} className="pt-3">
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