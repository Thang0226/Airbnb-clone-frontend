import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from '@coreui/react'
import styles from '../css/HouseList.module.css'
import CurrencyFormat from '../../_fragments/format/CurrencyFormat'
import { UserPagination } from '../../_fragments/CustomerPagination'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getHouseList, searchHouses } from '../../../redux/slices/houseSlice'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import { toast } from 'react-toastify'
import { HiOutlineSearch } from 'react-icons/hi'
import { TbEdit } from 'react-icons/tb'
import { useLocation } from 'react-router-dom'
import UpdateHouseStatusModal from '../../modals/UpdateHouseStatusModal'

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

  const [modalVisible, setModalVisible] = useState(false)


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

  }

  const handleCloseModal = async () => {
    setModalVisible(false)
    setNewStatus('')
    // await dispatch(getHouseList({ username, page, size }))
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
              <UpdateHouseStatusModal
                visible={modalVisible}
                onClose={handleCloseModal}
                selectedHouse={selectedHouse}
                newStatus={newStatus}
                setNewStatus={setNewStatus}
                refresh={()=> getHouseList({ username, page, size })}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </CContainer>
  )
}

export default HouseListTable