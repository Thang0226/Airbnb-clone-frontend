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
  CTableRow,
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

export default function HostList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  useEffect(() => {
    document.title = 'Admin | Host List'
  }, [])

  const token = localStorage.getItem('token')

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
        dispatch(fetchUsers(page, size))
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
          <span>User Details</span>
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
                      <CTableHeaderCell>Phone</CTableHeaderCell>
                      <CTableHeaderCell>Income</CTableHeaderCell>
                      <CTableHeaderCell>Houses For Rent</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {hosts.map((host) => (
                      <CTableRow key={host.id} className="align-middle">
                        <CTableDataCell>{host.fullName}</CTableDataCell>
                        <CTableDataCell>{host.phone}</CTableDataCell>
                        <CTableDataCell>{<CurrencyFormat value={host.totalIncome} />}</CTableDataCell>
                        <CTableDataCell>{host.housesForRent}</CTableDataCell>
                        <CTableDataCell
                          className="text-center"
                        >
                          <CBadge
                            color={host.status === 'ACTIVE' ? 'success' : 'secondary'}
                            className="py-2"
                            style={{ width: '80px' }}
                          >
                            {host.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell
                          className="text-center"
                        >
                          <CButton
                            size="sm"
                            color={host.status === 'ACTIVE' ? 'warning' : 'success'}
                            className="text-white"
                            style={{ width: '70px' }}
                            onClick={() => handleStatusChange(host)}
                          >
                            {host.status === 'ACTIVE' ? 'Lock' : 'Unlock'}
                          </CButton>
                          <CButton
                            size="sm"
                            color="primary"
                            className="text-white ms-2"
                            style={{ width: '70px' }}
                            onClick={() => navigate(`/admin/host/${host.id}`)}
                          >
                            Details
                          </CButton>
                          <CButton
                            size="sm"
                            color="success"
                            className="text-white ms-2"
                            style={{ width: '70px' }}
                            // onClick={() => handleApprove(request.id)}
                          >
                            Approve
                          </CButton>
                          <CButton
                            size="sm"
                            color="secondary"
                            className="text-white ms-2"
                            style={{ width: '70px' }}
                            // onClick={() => handleDecline(request.id)}
                          >
                            Decline
                          </CButton>
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