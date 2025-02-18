import React, { useEffect } from 'react'
import { fetchUserProfile } from '../../redux/slices/userProfileSlice'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../constants/api'
import UserInfoRow from './fragments/UPInfoRow'

const UserProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  useEffect(() => {
    document.title = 'Airbnb | Profile'
  }, [])

  useEffect(() => {
    dispatch(fetchUserProfile(username))
  }, [dispatch, username])

  const { userProfile, error, loading } = useSelector((state) => state.userProfile)

  if (loading || !userProfile) return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <CSpinner color="primary" size="lg" />
      <h1 className="mt-3">Loading profile...</h1>
    </div>
  )
  if (error) return (
    <div className="container mt-4">
      <CRow className="mt-4">
        <CCol md={6}>
          <h1 className="text-danger">Lỗi: {error}</h1>
        </CCol>
      </CRow>
    </div>
  )

  const goToProfileEdit = () => {
    navigate('/profile/edit', { state: { username: userProfile.username } })
  }

  return (
    <div className="container mt-4">
      <CRow className="justify-content-center mt-4">
        <CCol md={6}>
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