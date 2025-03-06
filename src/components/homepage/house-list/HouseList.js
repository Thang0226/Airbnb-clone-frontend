import React , { useState , useEffect } from 'react'
import axios from 'axios'
import HouseCard from './HouseCard'
import { useDispatch , useSelector } from 'react-redux'
import {
  CRow ,
  CCol ,
  CContainer , CCard , CLink ,
} from '@coreui/react'
import { BASE_URL_HOUSE } from '../../../constants/api'
import { setHouses } from '../../../redux/slices/houseSlice'

const HouseList = () => {
  const houseList = useSelector ( state => state.houses.list )
  const [loading , setLoading] = useState ( true )
  const dispatch = useDispatch ()

  useEffect ( () => {
    axios
      .get ( `${BASE_URL_HOUSE}` )
      .then ( (response) => {
        dispatch ( setHouses ( response.data ) )
        setLoading ( false )
      } )
      .catch ( (error) => {
        console.error ( 'There was an error fetching the data!' , error )
      } )
  } , [dispatch] )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <CContainer>
      <CRow className="d-flex justify-content-center align-items-center my-3 text-center text-success fw-bolder fs-3">
        Available Houses
      </CRow>
      <CRow className="g-4">
        {houseList.map ( (house) => (
          <CCol
            xs={12} md={6} lg={3} key={house.id}
          >
            <CCard className="h-100 shadow-sm rounded-3" style={{ border: 'none' }}>
              <HouseCard key={house.id} house={house} />
            </CCard>
          </CCol>
        ) )}
      </CRow>
    </CContainer>
  )
}

export default HouseList