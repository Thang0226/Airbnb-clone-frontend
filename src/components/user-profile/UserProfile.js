import React, { useEffect } from 'react'
import { fetchUserProfile } from '../../redux/slices/userProfileSlice'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../constants/api'
import { DisplayLoading } from '../DisplayLoading'
import { DisplayError } from '../DisplayError'
import UserInfoRow from '../_fragments/FORMInfoRow'

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
    <DisplayLoading/>
  )
  if (error) return (
    <DisplayError error={error} />
  )

  const goToProfileEdit = () => {
    if (role === "ROLE_ADMIN") {
      return navigate('/admin/profile/edit', { state: { username: userProfile.username } })
    }
    navigate('/profile/edit', { state: { username: userProfile.username } })
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
              <UserInfoRow label="Full Name" value={userProfile.fullName} />
              <UserInfoRow label="Address" value={userProfile.address} />
              <UserInfoRow label="Phone" value={userProfile.phone} />
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