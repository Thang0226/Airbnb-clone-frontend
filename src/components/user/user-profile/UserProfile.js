import React, { useEffect } from 'react'
import { fetchUserProfile } from '../../../redux/slices/userProfileSlice'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../../constants/api'
import { DisplayLoading } from '../../DisplayLoading'
import { DisplayError } from '../../DisplayError'
import TextInfoRow from '../../_fragments/FORMInfoRow'

const UserProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const role = localStorage.getItem('role')

  useEffect(() => {
    document.title = 'Airbnb | Profile'
  }, [])

  useEffect(() => {
    dispatch(fetchUserProfile(username))
  }, [dispatch, username])

  const { userProfile, error, loading } = useSelector((state) => state.userProfile)

  if (loading || !userProfile) return (
    <DisplayLoading message={"Loading User Profile..."}/>
  )
  if (error) return (
    <DisplayError error={error} />
  )

  const goToProfileEdit = () => {
    const formattedRole = role.replace(/^ROLE_+/, '').toLowerCase();
    const path = formattedRole !== "user" ? `/${formattedRole}/profile/edit` : "/profile/edit";

    navigate(path, { state: { username: userProfile.username, role: formattedRole} });
  }

  return (
    <div className="container mt-4">
      <CRow
        xs={{cols: 1}} md={{cols: 1}} lg={{cols: 2}}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4">
              <img
                src={
                  userProfile.avatar
                    ? `${BASE_URL}/images/${userProfile.avatar}`
                    : `${BASE_URL}/images/default.jpg`
                }
                alt={userProfile.username}
                className="rounded-circle border border-blue border-4"
                width="150"
                height="150"
                style={{ objectFit: 'cover' }}
              />
              <h3 className="mt-3">{userProfile.username}</h3>
            </CCardHeader>
            <CCardBody className="p-4 row">
              <TextInfoRow label="Full Name" value={userProfile.fullName} />
              <TextInfoRow label="Address" value={userProfile.address} />
              <TextInfoRow label="Phone" value={userProfile.phone} />
              <TextInfoRow label="Email" value={userProfile.email} />
              <div className="text-center mt-3">
                <CButton color="primary" onClick={goToProfileEdit}>
                  Edit Profile
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default UserProfile