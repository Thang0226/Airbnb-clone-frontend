import { useDispatch, useSelector } from 'react-redux'
import { CButton, CCard, CCardBody, CCardText, CCol, CContainer, CInputGroup, CRow } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'
import axiosInstance from '../../services/axiosConfig'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import DatePicker from 'react-datepicker'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BASE_URL_HOUSE } from '../../constants/api'
import { setHouse } from '../../redux/slices/houseSlice'

export default function HouseRent({houseId}) {
  const dispatch = useDispatch()
  const today = dayjs().toDate();
  const selectedHouse = useSelector(state => state.houses.house)
  const [isLoading, setIsLoading] = useState(true)
  const [totalDays, setTotalDays] = useState(0)
  const [totalCost, setTotalCost] = useState(selectedHouse.price)
  const [bookedDates, setBookedDates] = useState([])
  const [maxAvailableDate, setMaxAvailableDate] = useState(today)
  const [minAvailableDate, setMinAvailableDate] = useState(today)
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(today)

  const getLatestAvailableDate = async (date) => {
    const res = await axiosInstance.post(`/houses/house-edge-date`, {
      houseId: houseId,
      date: date,
    });
    setMaxAvailableDate(dayjs(res.data).toDate());
  };

  const getBookedDates = async () => {
    let res = await axiosInstance.get(`/houses/${houseId}/booked-dates`);
    return res.data.map(bookingDTO => {
      return {
        start: dayjs(new Date(bookingDTO.startDate)).subtract(1, 'day').toDate(),
        end: new Date(bookingDTO.endDate),
      }
    })
  };

  const initializeDates = async () => {
    const bookedDatesList = await getBookedDates();
    let newMinDate = today;
    for (let i = 0; i < bookedDatesList.length; i++) {
      if (bookedDatesList[i].start <= today && today <= bookedDatesList[i].end) { // Today cannot be booked --> find future available period
        newMinDate = dayjs(bookedDatesList[i].end).add(1, 'day').toDate();
        break;
      }
    }
    setMinAvailableDate(newMinDate);
    setCheckIn(newMinDate);
    setCheckOut(newMinDate);
    setBookedDates(bookedDatesList);

    setIsLoading(false);
  }
  useEffect(() => {
    initializeDates().catch((err) => {console.log(err)});
  }, [selectedHouse])

  useEffect(() => {
    getLatestAvailableDate(checkIn).catch((err) => {console.log(err)});
    let totalDays = Math.round((checkOut - checkIn) / (60 * 60 * 24 * 1000));
    if (totalDays <= 0) {
      totalDays = 0;
    }
    setTotalDays(totalDays);
    let totalCost = selectedHouse.price * totalDays;
    setTotalCost(totalCost);
  }, [checkIn, checkOut]);

  const  handleRentHouse = async () => {
    try {
      if (totalDays === 0) {
        toast.info("Have to rent at least one night");
        return;
      }
      let data = {
        houseId: selectedHouse.id,
        userId: localStorage.getItem('userId'),
        startDate: dayjs(checkIn).format('YYYY-MM-DD'),
        endDate: dayjs(checkOut).format('YYYY-MM-DD'),
        price: totalCost,
      };

      const response = await axiosInstance.post('/houses/rent-house', data);
      toast.success(response.data);
      const houseUpdated = await axios.get(`${BASE_URL_HOUSE}/${houseId}`);
      dispatch(setHouse(houseUpdated.data));

    } catch (error) {
      toast.error(error.response.data || error.message);
      console.log(error);
    }
  }

  if (isLoading) {
    return <h2>Loading...</h2>; // Show a loading state while fetching
  }

  return (
    <CContainer className="bg-light px-4 rounded-4 shadow-sm py-1">
          <CRow className="align-items-center my-3">
            {/* Check-In Date */}
            <CCol sm={12} md={4}>
                <CInputGroup className="border-0">
                    <label className="fw-bolder fs-6">Check-In</label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => {setCheckIn(date); setCheckOut(date)}}
                      className="form-control border-0 text-center bring-front"
                      minDate={minAvailableDate}
                      dateFormat="dd/MM/yyyy"
                      excludeDateIntervals={bookedDates}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                    />
                </CInputGroup>
            </CCol>
            {/* Check-Out Date */}
            <CCol sm={12} md={4}>
                <CInputGroup className="border-0">
                    <label className="fw-bolder fs-6">Check-Out</label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      className="form-control border-0 text-center bring-front"
                      minDate={checkIn ? checkIn : null}
                      maxDate={checkIn ? maxAvailableDate : null}
                      dateFormat="dd/MM/yyyy"
                      excludeDateIntervals={bookedDates}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
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
                Rent House
              </CButton>
            </CCol>
          </CRow>
        </CContainer>
  )
}