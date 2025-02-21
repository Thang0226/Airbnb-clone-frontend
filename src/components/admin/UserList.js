import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react'
import { fetchUsers, updateUserStatus } from '../../redux/slices/userManagementSlice'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import {
  CBadge, CButton, CCard,
  CCardBody,
  CCardHeader, CCol,
  CRow,
  CTable,
  CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { toast } from 'react-toastify'
import Pagination from 'react-bootstrap/Pagination';
import { useNavigate } from 'react-router-dom'

export const UserList = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Airbnb | User List';
  }, [])

  useEffect(() => {
    dispatch(fetchUsers({page, size}));
  }, [dispatch,page,size]);

  const { users, error, loading, totalPages } = useSelector((state) => state.userManagement);

  if (loading || !users) return (
    <DisplayLoading/>
  )
  if (error) return (
    <DisplayError error={error} />
  )

  const handleApprove = (user) => {
    dispatch(updateUserStatus(user.id))
      .then(() => {
        if (user.status === 'ACTIVE') {
          toast.success(
            <div>
             Locked user <span style={{ fontWeight: 'bold' }}>{user.username}</span>!
            </div>
          );
        } else {
          toast.success(
            <div>
              Unlocked user <span style={{ fontWeight: 'bold' }}>{user.username}</span>!
            </div>
          );
        }
        dispatch(fetchUsers(page, size));
      })
      .catch((error) => {
        toast.error("Error updating user status:", error);
      });
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const goToUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate(-1)}
        >
          Dash Board
        </span>
        <span className="mx-1">{'/'}</span>
        <span>User Details</span>
      </div>
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 1 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="my-3">User List</h4>
            </CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user) => (
                    <CTableRow key={user.id}>
                      <CTableDataCell>{user.username}</CTableDataCell>
                      <CTableDataCell>{user.phone}</CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                      >
                        <CBadge
                          color={user.status === 'ACTIVE' ? "success" : "secondary"}
                          className="py-2"
                          style={{ width: "90px" }}
                        >
                          {user.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                      >
                        <CButton
                          size="sm"
                          color={user.status === 'ACTIVE' ? "warning" : "success"}
                          className="text-white"
                          style={{ width: "90px" }}
                          onClick={() => handleApprove(user)}
                        >
                          {user.status === 'ACTIVE' ? "Lock" : "Unlock"}
                        </CButton>
                        <CButton
                          size="sm"
                          color="primary"
                          className="text-white ms-2"
                          style={{ width: "90px" }}
                          onClick={() => goToUserDetails(user.id)}
                        >
                          Details
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
                <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1} />
              </Pagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}