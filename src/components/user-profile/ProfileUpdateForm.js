import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import {
  CButton,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile, updateUserProfile } from '../../redux/slices/userProfileSlice'
import { toast } from 'react-toastify'
import UPAvatarInput from './fragments/UPAvatarInput'
import UPTextInput from './fragments/UPTextInput'

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  phone: Yup.string()
    .matches(/^0[0-9]{9}$/, 'Phone number must start with 0 and have at least 10 digits')
    .required('Phone number is required'),
})

const getInitialValues = (userProfile) => ({
  username: userProfile.username || '',
  fullName: userProfile.fullName || '',
  address: userProfile.address || '',
  phone: userProfile.phone || '',
  avatar: userProfile.avatar || 'default.jpg',
})

const ProfileUpdateForm = () => {
  const [avatarPreview, setAvatarPreview] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { username } = location.state || {}

  useEffect(() => {
    document.title = 'Airbnb | Update Profile'
  }, [])

  useEffect(() => {
    dispatch(fetchUserProfile(username))
  }, [dispatch, username])

  const { userProfile, error, loading } = useSelector((state) => state.userProfile)

  if (loading || !userProfile) return (
    <div className="container mt-4">
      <CRow className="justify-content-center mt-4">
        <CCol md={6}>
          <h1 className="text-center">Loading profile...</h1>
        </CCol>
      </CRow>
    </div>
  )
  if (error) return (
    <div className="container mt-4">
      <CRow className="justify-content-center mt-4">
        <CCol md={6}>
          <h1 className="text-danger">Lỗi: {error}</h1>
        </CCol>
      </CRow>
    </div>
  )

  const handleSubmit = (values, { setSubmitting }) => {
    const originalValues = getInitialValues(userProfile)
    let isChanged = false
    if (values.fullName !== originalValues.fullName) isChanged = true
    if (values.address !== originalValues.address) isChanged = true
    if (values.phone !== originalValues.phone) isChanged = true
    if (values.avatar instanceof File) isChanged = true

    if (!isChanged) {
      setSubmitting(false)
      toast.info('No changes were made.')
      navigate('/profile')
      return
    }
    const formData = new FormData()
    Object.keys(values).forEach((key) => {
      if (key === 'avatar') {
        if (values[key] instanceof File) {
          formData.append(key, values[key])
        }
      } else {
        formData.append(key, values[key])
      }
    })

    dispatch(updateUserProfile(formData))
      .then(() => {
        toast.success('Profile updated successfully!')
        navigate('/profile')
      })
      .catch((err) => {
        toast.error('Error updating profile: ' + err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleAvatarChange = (e, setFieldValue) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFieldValue('avatar', file)
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mt-4">
      <CRow className="justify-content-center mt-4">
        <CCol md={6}>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4">
              <h3>Update Profile</h3>
            </CCardHeader>
            <CCardBody className="p-4">
              <Formik
                initialValues={getInitialValues(userProfile)}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <UPTextInput label="Username" name="username" readOnly />

                    <UPAvatarInput
                      avatarPreview={avatarPreview}
                      userProfile={userProfile}
                      handleAvatarChange={handleAvatarChange}
                      setFieldValue={setFieldValue}
                    />

                    <UPTextInput
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                    />

                    <UPTextInput
                      label="Address"
                      name="address"
                      placeholder="Enter your address"
                    />

                    <UPTextInput
                      label="Phone Number"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                    />

                    <div className="text-center">
                      <CButton type="submit" color="primary" disabled={isSubmitting}>
                        Update Profile
                      </CButton>
                      <CButton
                        type="button"
                        color="secondary"
                        className="ms-2"
                        onClick={() => navigate(`/profile`)}
                      >
                        Cancel
                      </CButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )

}

export default ProfileUpdateForm