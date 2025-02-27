  import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer, CFormInput, CFormSelect, CRow,
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
  import { getHouseList, searchHouses } from '../../../redux/slices/houseSlice'
  import { DisplayLoading } from '../../DisplayLoading'
  import { DisplayError } from '../../DisplayError'

  const HouseList = () => {
    const [page, setPage] = useState(0)
    const [size] = useState(10)
    const dispatch = useDispatch()
    const username = localStorage.getItem('username')

    const [houseName, setHouseName] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
      document.title = 'Airbnb | House List'
    }, [])

    useEffect(() => {
      dispatch(getHouseList({ username, page, size }))
    }, [dispatch, page, size, username])

    const handleSearch = () => {
      dispatch(searchHouses({ username, houseName, status, page, size }));
    };

    const { houseList, error, loading, totalPages } = useSelector((state) => state.houses)

    if (loading || !houseList) return (
      <DisplayLoading />
    )
    if (error) return (
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
              className="w-auto"
              onClick={handleSearch}
            >
              Search
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