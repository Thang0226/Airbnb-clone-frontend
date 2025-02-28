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
import { useNavigate } from 'react-router-dom'
import { ConfirmModal } from '../modals/StatusChangeConfirm';
import { UserPagination } from '../_fragments/CustomerPagination'

export const UserList = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const confirmStatusChange = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleStatusChange = () => {
    if (!selectedUser) return;
    dispatch(updateUserStatus(selectedUser.id))
      .then(() => {
        toast.success(
          <div>
            {selectedUser.status === 'ACTIVE' ? "Locked" : "Unlocked"} user <span style={{ fontWeight: 'bold' }}>{selectedUser.username}</span>!
          </div>
        );
        dispatch(fetchUsers({ page, size }));
      })
      .catch((error) => {
        toast.error("Error updating user status:", error);
      })
      .finally(() => {
        setShowModal(false);
        setSelectedUser(null);
      });
  }

  const goToUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center">
        <span
          style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
          onClick={() => navigate("/admin")}
        >
          Dashboard
        </span>
        <span className="mx-1">{'/'}</span>
        <span>User List</span>
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
                    <CTableRow key={user.id} className='align-middle'>
                      <CTableDataCell>{user.username}</CTableDataCell>
                      <CTableDataCell>{user.phone}</CTableDataCell>
                      <CTableDataCell
                        className="text-center"
                      >
                        <CBadge
                          color={user.status === 'ACTIVE' ? "success" : "secondary"}
                          className="py-2 rounded-pill"
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
                          onClick={() => confirmStatusChange(user)}
                        >
                          {user.status === 'ACTIVE' ? "Lock" : "Unlock"}
                        </CButton>
                        <ConfirmModal
                          visible={showModal}
                          onClose={() => setShowModal(false)}
                          onConfirm={handleStatusChange}
                          user={selectedUser}
                        />
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
              <UserPagination page={page} totalPages={totalPages} setPage={setPage} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}