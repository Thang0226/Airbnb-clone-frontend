import React, { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTooltip,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHosts } from '../../redux/slices/hostManagementSlice'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import { updateUserStatus } from '../../redux/slices/userManagementSlice'
import { useNavigate } from 'react-router-dom'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'
import { UserPagination } from '../_fragments/CustomerPagination'
import HostRequests from './HostRequests'
import { FiLock, FiUnlock } from 'react-icons/fi'
import { PiListMagnifyingGlass } from 'react-icons/pi'
import { ConfirmModal } from '../modals/StatusChangeConfirm'

export default function HostList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedHost, setSelectedHost] = useState(null)

  useEffect(() => {
    document.title = 'Admin | Host List'
  }, [])

  useEffect(() => {
    dispatch(fetchHosts({ page, size }))
  }, [dispatch, page, size])

  const { hosts, error, loading, totalPages } = useSelector((state) => state.hostManagement)

  if (loading || !hosts) return (
    <DisplayLoading message={"Loading Host List..."} />
  )
  if (error) return (
    <DisplayError error={error} />
  )

  const handleStatusChange = (host) => {
    setSelectedHost(host)
    console.log(host)
    setModalVisible(true)
  }

  const confirmStatusChange = () => {
    dispatch(updateUserStatus(selectedHost.id))
      .then(() => {
        const action = selectedHost.status === 'ACTIVE' ? 'locked' : 'unlocked'

        if (selectedHost.status === 'ACTIVE') {
          emailjs.send(
            'service_dxda23k',
            'template_cym5629',
            {
              from_name: 'Admin',
              to_name: selectedHost.fullName,
              to_email: selectedHost.email,
            },
            'jQMz6RS6A_JelwyJq',
          ).then(
            (response) => {
              toast.success(
                <div>
                  User <strong>{selectedHost.username}</strong> has been {action} and notified via email!
                </div>
              )
              console.log("Response: " + response)
            },
            (error) => toast.error('Failed to send email: ' + error),
          )
        } else {
          toast.success(
            <div>
              User <strong>{selectedHost.username}</strong> has been {action}!
            </div>
          )
        }
      })
      .catch((error) => {
        toast.error('Error updating host status:', error)
      })
      .finally(() => {
        dispatch(fetchHosts({ page, size }))
        setModalVisible(false)
      })
  }

  return (
    <div>
      <div className="container">
        <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate('/admin')}
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
                      <CTableHeaderCell>User Name</CTableHeaderCell>
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
                        <CTableDataCell>{host.username}</CTableDataCell>
                        <CTableDataCell>{host.fullName}</CTableDataCell>
                        <CTableDataCell className="text-center">{host.phone}</CTableDataCell>
                        <CTableDataCell className="text-end">{<CurrencyFormat
                          value={host.totalIncome} />}</CTableDataCell>
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
                          <CTooltip content={host.status === 'ACTIVE' ? 'Lock' : 'Unlock'}>
                            <CButton
                              size="md"
                              color={host.status === 'ACTIVE' ? 'warning' : 'success'}
                              className="text-white d-flex align-items-center justify-content-center"
                              onClick={() => handleStatusChange(host)}
                            >
                              {host.status === 'ACTIVE'
                                ? <FiLock style={{ width: '20px', height: '20px' }} />
                                : <FiUnlock style={{ width: '20px', height: '20px' }} />
                              }
                            </CButton>
                          </CTooltip>
                          <ConfirmModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            onConfirm={confirmStatusChange}
                            user={selectedHost}
                          />
                          <CTooltip content={'Details'}>
                            <CButton
                              size="md"
                              color="primary"
                              className="text-white d-flex align-items-center justify-content-center"
                              onClick={() => navigate(`/admin/host/${host.id}`)}
                            >
                              <PiListMagnifyingGlass style={{ width: '20px', height: '20px' }} />
                            </CButton>
                          </CTooltip>

                          {/*<CTooltip content={'Approve'}>*/}
                          {/*  <CButton*/}
                          {/*    size="md"*/}
                          {/*    color="info"*/}
                          {/*    className="text-white d-flex align-items-center justify-content-center"*/}
                          {/*    // onClick={() => handleApprove(request.id)}*/}
                          {/*  >*/}
                          {/*    <FiCheckSquare style={{ width: '20px', height: '20px' }} />*/}
                          {/*  </CButton>*/}
                          {/*</CTooltip>*/}

                          {/*<CTooltip content={'Decline'}>*/}
                          {/*  <CButton*/}
                          {/*    size="md"*/}
                          {/*    color="secondary"*/}
                          {/*    className="text-white d-flex align-items-center justify-content-center"*/}
                          {/*    // onClick={() => handleDecline(request.id)}*/}
                          {/*  >*/}
                          {/*    <FiXSquare style={{ width: '20px', height: '20px' }} />*/}
                          {/*  </CButton>*/}
                          {/*</CTooltip>*/}
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
      <HostRequests />
    </div>

  )
}