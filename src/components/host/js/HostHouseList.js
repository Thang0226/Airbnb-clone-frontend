import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardFooter, CCol, CRow, CSpinner } from '@coreui/react'
import { BASE_URL_HOUSE } from '../../../constants/api'
import { setHouses } from '../../../redux/slices/houseSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TbEdit } from 'react-icons/tb'
import styles from '../css/HouseList.module.css'
import api from '../../../services/axiosConfig'
import HouseCard from '../../homepage/HouseCard'

export default function HostHouseList() {
  const houseList = useSelector ( state => state.houses.list )
  const [loading , setLoading] = useState ( true )
  const [error , setError] = useState ( null )
  const dispatch = useDispatch ()
  const navigate = useNavigate ()
  const hostId = useSelector(state => state.account.userId)


  useEffect ( () => {
    const getHousesByHostId = async () => {
      setLoading ( true )
      setError ( null )
      try {
        const response = await api.get ( `${BASE_URL_HOUSE}/host/${hostId}` ) // da co token
        dispatch ( setHouses ( response.data ) )
      } catch (err) {
        setError ( 'Failed to fetch house details. Please try again.' )
        console.log ( err )
      } finally {
        setLoading ( false )
      }
    }
    getHousesByHostId ()
  } , [dispatch, hostId] )

  if (loading) {
    return (
      <CCard className="mt-4 bg-warning justify-content-center rounded-3">
        <CSpinner color="primary" /> Loading
      </CCard>
    )
  }
  if (error) {
    return (
      <CCard className="mt-4 bg-warning justify-content-center rounded-3">
        <CCardBody className="text-center text-white">
          {error}
        </CCardBody>
      </CCard>
    )
  }
  if (!houseList) {
    return (
      <CCard className="mt-4 rounded-3 bg-primary-subtle">
        <CCardBody className="text-center p-4 mt-3">
          You don’t have any guests checking out today or tomorrow.
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CRow className="mt-4 gap-4">
      {houseList.map ( (house) => (
        <CCol xs={12} md={6} lg={4} key={house.id} onClick={() => navigate ( `/host/house/${house.id}` )}>
          <CCard className="h-100 shadow-sm rounded-3" style={{ border: 'none' }}>
            <HouseCard house={house} />
            <CCardFooter className="bg-light d-flex justify-content-between align-items-center">
              <span className="text-muted">Status: {house.status || 'Not specified'}</span>
              <CButton
                size="md"
                onClick={() => navigate ( `/host/update/${house.id}` )}
                className={styles['update-house-btn']}
              >
                <TbEdit style={{ width: '22px', height: '22px' }}/>
              </CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      ) )}
    </CRow>
  )
}