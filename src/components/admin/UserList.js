import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react'
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

export const UserList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'Airbnb | User List';
  }, [])

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { users, error, loading } = useSelector((state) => state.userManagement);

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
        dispatch(fetchUsers());
      })
      .catch((error) => {
        toast.error("Error updating user status:", error);
      });
  }

  return (
    <div className="container mt-4">
      <CRow
        xs={{cols: 1}} md={{cols: 1}} lg={{cols: 1}}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard>
            <CCardHeader>
              <h4 className="mb-0">User List</h4>
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
                          style={{width: "90px"}}
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
                          style={{width: "90px"}}
                          onClick={() => handleApprove(user)}
                        >
                          {user.status === 'ACTIVE' ? "Lock" : "Unlock"}
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}