import React, { useEffect, useState } from 'react'
import axios from 'axios'
import emailjs from '@emailjs/browser'
import { BASE_URL_USER } from '../../constants/api'
import { toast } from 'react-toastify'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader, CCol, CRow,
  CTable,
  CTableBody,
  CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow, CTooltip,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHosts } from '../../redux/slices/hostManagementSlice'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import { fetchUsers, updateUserStatus } from '../../redux/slices/userManagementSlice'
import { useNavigate } from 'react-router-dom'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import { UserPagination } from '../_fragments/CustomerPagination'
import HostRequests from './HostRequests'
import { FiCheckSquare, FiLock, FiUnlock, FiXSquare } from 'react-icons/fi'
import { PiListMagnifyingGlass } from 'react-icons/pi'

export default function HostList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  useEffect(() => {
    document.title = 'Admin | Host List'
  }, [])

  useEffect(() => {
    dispatch(fetchHosts({ page, size }))
  }, [dispatch, page, size])

  const { hosts, error, loading, totalPages } = useSelector((state) => state.hostManagement)

  if (loading || !hosts) return (
    <DisplayLoading />
  )
  if (error) return (
    <DisplayError error={error} />
  )

  const handleStatusChange = (host) => {
    dispatch(updateUserStatus(host.id))
      .then(() => {
        if (host.status === 'ACTIVE') {
          toast.success(
            <div>
              Locked user <span style={{ fontWeight: 'bold' }}>{host.username}</span>!
            </div>,
          )
        } else {
          toast.success(
            <div>
              Unlocked user <span style={{ fontWeight: 'bold' }}>{host.username}</span>!
            </div>,
          )
        }
        dispatch(fetchHosts(page, size))
      })
      .catch((error) => {
        toast.error('Error updating user status:', error)
      })
  }

  return (
    <div>
      <div className="container">
        <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </span>
          <span className="mx-1">{'/'}</span>
          <span>Host List</span>
        </div>
        <CRow
          xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
          className="justify-content-center align-items-center mt-4"
        >
          <CCol>
            <CCard>
              <CCardHeader>
                <h4 className="my-3">Host List</h4>
              </CCardHeader>
              <CCardBody>
                <CTable hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Full Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Phone</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Income</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Houses For Rent</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {hosts.map((host) => (
                      <CTableRow key={host.id} className="align-middle">
                        <CTableDataCell>{host.fullName}</CTableDataCell>
                        <CTableDataCell className="text-center">{host.phone}</CTableDataCell>
                        <CTableDataCell className="text-end">{<CurrencyFormat value={host.totalIncome} />}</CTableDataCell>
                        <CTableDataCell className="text-end">{host.housesForRent}</CTableDataCell>
                        <CTableDataCell
                          className="text-center"
                        >
                          <CBadge
                            color={host.status === 'ACTIVE' ? 'success' : 'dark'}
                            className="py-2 rounded-pill"
                            style={{ width: '80px' }}
                          >
                            {host.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell
                          className="d-flex align-items-center justify-content-center gap-2"
                        >
                          <CTooltip content={host.status === "ACTIVE" ? "Lock" : "Unlock"}>
                            <CButton
                              size="md"
                              color={host.status === 'ACTIVE' ? 'warning' : 'success'}
                              className="text-white d-flex align-items-center justify-content-center"
                              onClick={() => handleStatusChange(host)}
                            >
                              {host.status === 'ACTIVE'
                                ? <FiLock style={{ width: '20px', height: '20px' }}/>
                                : <FiUnlock style={{ width: '20px', height: '20px' }}/>
                              }
                            </CButton>
                          </CTooltip>

                          <CTooltip content={"Details"}>
                            <CButton
                              size="md"
                              color="primary"
                              className="text-white d-flex align-items-center justify-content-center"
                              onClick={() => navigate(`/admin/host/${host.id}`)}
                            >
                              <PiListMagnifyingGlass  style={{ width: '20px', height: '20px' }}/>
                            </CButton>
                          </CTooltip>

                          <CTooltip content={"Approve"}>
                            <CButton
                              size="md"
                              color="info"
                              className="text-white d-flex align-items-center justify-content-center"
                              // onClick={() => handleApprove(request.id)}
                            >
                              <FiCheckSquare style={{ width: '20px', height: '20px' }}/>
                            </CButton>
                          </CTooltip>

                          <CTooltip content={"Decline"}>
                            <CButton
                              size="md"
                              color="secondary"
                              className="text-white d-flex align-items-center justify-content-center"
                              // onClick={() => handleDecline(request.id)}
                            >
                              <FiXSquare style={{ width: '20px', height: '20px' }}/>
                            </CButton>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <UserPagination page={page} totalPages={totalPages} setPage={setPage} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
      {/*Host requests table*/}
      <HostRequests/>
    </div>

  )
}