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
import Pagination from 'react-bootstrap/Pagination'
import { useNavigate } from 'react-router-dom'
import CurrencyFormat from '../_fragments/format/CurrencyFormat'

export default function HostList() {
  const [requests, setRequests] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  const fetchHostRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL_USER}/host-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRequests(response.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load host requests')
    }
  }

  useEffect(() => {
    document.title = 'Admin | Host List'
  }, [])

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchHostRequests()
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
        dispatch(fetchUsers(page, size))
      })
      .catch((error) => {
        toast.error('Error updating user status:', error)
      })
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  const handleApprove = async (requestId) => {
    let response
    try {
      response = await axios.post(`${BASE_URL_USER}/host-requests/${requestId}/approve`,
        {}, // empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
      toast.success('Host request approved')

      emailjs
        .send(
          'service_p6wbmae', // Service ID
          'template_piwv2fk', // Template ID
          {
            from_name: 'Airbnb-clone App',
            to_email: 'thang.nd0226@gmail.com',
            to_name: 'Admin',
            message: 'Accepted new host registration: \n\tUsername: ' + response.data,
          },
          '1N9KYwqlDUuHvGQMW', // Public Key
        )
        .then(
          (response) => {
            console.log('Email sent successfully:', response)
          },
          (error) => {
            console.error('Failed to send email:', error)
          },
        )

      await fetchHostRequests() // Refresh the list

    } catch (error) {
      console.error('Error approving request:', error)
      toast.error('Failed to approve request')
    }
  }

  const handleDecline = async (requestId) => {
    let response
    try {
      response = await axios.post(`${BASE_URL_USER}/host-requests/${requestId}/decline`,
        {}, // empty body
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
      )
      toast.success('Host request declined')

      emailjs
        .send(
          'service_p6wbmae',
          'template_piwv2fk',
          {
            from_name: 'Airbnb-clone App',
            to_email: 'thang.nd0226@gmail.com',
            to_name: 'Admin',
            message: 'Declined new host registration. \n\tUsername: ' + response.data + '\nUser account is still created.',
          },
          '1N9KYwqlDUuHvGQMW',
        )
        .then(
          (response) => {
            console.log('Email sent successfully:', response)
          },
          (error) => {
            console.error('Failed to send email:', error)
          },
        )

      await fetchHostRequests()

    } catch (error) {
      console.error('Error approving request:', error)
      toast.error('Failed to approve request')
    }
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
                <Pagination className="mt-3 justify-content-center">
                  <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
                  <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />

                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item key={index} active={index === page} onClick={() => handlePageChange(index)}>
                      {index + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
                  <Pagination.Last onClick={() => handlePageChange(totalPages - 1)}
                                   disabled={page === totalPages - 1} />
                </Pagination>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
      <div>
        <CCard>
          <CCardHeader className="text-center p-4">
            <h3>Host Requests</h3>
          </CCardHeader>
          <CCardBody>
            <CTable hover responsive>
              <CTableHead className="fs-5">
                <CTableRow>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Phone</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Request Date</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {requests.map((request) => (
                  <CTableRow key={request.id} className="align-middle fs-5">
                    <CTableDataCell>{request.user.username}</CTableDataCell>
                    <CTableDataCell className="text-center">{request.user.phone}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="success"
                        className="fs-5 cursor-pointer text-white me-3"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </CButton>
                      <CButton
                        color="secondary"
                        className="fs-5 cursor-pointer text-white"
                        onClick={() => handleDecline(request.id)}
                      >
                        Decline
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </div>
    </div>

  )
}