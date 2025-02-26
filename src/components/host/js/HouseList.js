  import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer, CFormSelect, CRow,
    CTable, CTableBody, CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
  import styles from '../css/HoustList.module.css'
  import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
  import { UserPagination } from '../../_fragments/CustomerPagination'
  import React, { useEffect, useState } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
  import { getHouseList } from '../../../redux/slices/houseSlice'
  import { DisplayLoading } from '../../DisplayLoading'
  import { DisplayError } from '../../DisplayError'

  const HouseList = () => {
    const [page, setPage] = useState(0)
    const [size] = useState(10)
    const dispatch = useDispatch()
    const username = localStorage.getItem('username')

    const [status, setStatus] = useState('')

    useEffect(() => {
      document.title = 'Airbnb | House List'
    }, [])

    useEffect(() => {
      dispatch(getHouseList({ username, page, size }))
    }, [dispatch, page, size, username])

    const { houseList, error, loading, totalPages } = useSelector((state) => state.houses)

    if (loading || !houseList) return (
      <DisplayLoading />
    )
    if (error) return (
      <DisplayError error={error} />
    )

    return (
      <CContainer>
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
                        <CTableHeaderCell className="text-center">Daily Rent</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Revenue</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {houseList.map((house) => (
                        <CTableRow key={house.id} className="align-middle" >
                          <CTableDataCell className={styles['house-name']} title={house.houseName}>
                            {house.houseName}
                          </CTableDataCell>
                          <CTableDataCell>{house.address}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CurrencyFormat value={house.price} />
                          </CTableDataCell>
                          <CTableDataCell className="text-end">
                            <CurrencyFormat value={house.totalRevenue} />
                          </CTableDataCell>
                          <CTableDataCell className="d-flex justify-content-center">
                            {house.status}
                            {/*<CFormSelect*/}
                            {/*  value={house.status}*/}
                            {/*  onChange={(e) => setStatus(e.target.value)}*/}
                            {/*  className="w-auto"*/}
                            {/*  disabled={house.status === "RENTED"}*/}
                            {/*>*/}
                            {/*  <option value="AVAILABLE">AVAILABLE</option>*/}
                            {/*  <option value="MAINTAINING">MAINTAINING</option>*/}
                            {/*  {!["AVAILABLE", "MAINTAINING"].includes(house.status) && (*/}
                            {/*    <option value={house.status}>{house.status}</option>*/}
                            {/*  )}*/}
                            {/*</CFormSelect>*/}
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                )}
                {houseList && houseList.length > 0 &&
                  <UserPagination page={page} totalPages={totalPages} setPage={setPage} />}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    )
  }

  export default HouseList