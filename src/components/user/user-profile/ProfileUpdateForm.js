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
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserProfile, updateUserProfile } from '../../../redux/slices/userProfileSlice'
import { toast } from 'react-toastify'
import FORMAvatarInput from '../../_fragments/FORMAvatarInput'
import FORMTextInput from '../../_fragments/FORMTextInput'

const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg']

const validationSchema = Yup.object({
  fullName: Yup.string()
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Full Name cannot contain special characters')
    .required('Full Name is required'),
  address: Yup.string()
    .matches(/^[a-zA-Z0-9À-ỹ\s,.]+$/, 'Address cannot contain special characters')
    .required('Address is required'),
  phone: Yup.string()
    .matches(/^0[0-9]{9}$/, 'Phone number must start with 0 and have at least 10 digits')
    .required('Phone number is required'),
  email: Yup.string()
    .matches(/^[a-z0-9._%+]+@[a-z0-9_]+\.[a-z]{2,5}$/, 'Invalid email address')
    .required('Email is required'),
  avatar: Yup.mixed()
    .nullable()
    .notRequired()
    .test('fileSize', 'File size exceeds 5MB.', (value) => {
      console.log(value)
      if (value) {
        return value.size <= FILE_SIZE_LIMIT
      } else {
        return true
      }
    })
    .test('fileFormat', 'Invalid file format. Only JPG, JPEG, PNG are allowed.', (value) => {
      if (value) {
        return SUPPORTED_FORMATS.includes(value.type)
      } else {
        return true
      }
    }),
})

const getInitialValues = (userProfile) => ({
  username: userProfile.username || '',
  fullName: userProfile.fullName || '',
  address: userProfile.address || '',
  phone: userProfile.phone || '',
  email: userProfile.email || '',
  avatar: '',
})

const ProfileUpdateForm = () => {
  const [avatarPreview, setAvatarPreview] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { username, role } = location.state || {}

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
    if (values.email !== originalValues.email) isChanged = true
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

      if (file.size > FILE_SIZE_LIMIT) {
        return
      }
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        return
      }

      // Nếu không có lỗi, cập nhật giá trị cho avatar

      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setFieldValue('avatar', '')
    }
  }

  const handleCancel = () => {
    const path = role !== 'user' ? `/${role}/profile` : '/profile'
    navigate(path)
  }

  return (
    <div className="container mt-4">
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 2 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-2">
              <h3 className="m-0">Update Profile</h3>
            </CCardHeader>
            <CCardBody className="p-4">
              <Formik
                initialValues={getInitialValues(userProfile)}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, setFieldValue }) => (
                  <Form>
                    <FORMTextInput label="Username" name="username" readOnly />

                    <FORMAvatarInput
                      avatarPreview={avatarPreview}
                      userProfile={userProfile}
                      handleAvatarChange={handleAvatarChange}
                      setFieldValue={setFieldValue}
                    />

                    <FORMTextInput
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter your full name"
                      required
                    />

                    <FORMTextInput
                      label="Address"
                      name="address"
                      placeholder="Enter your address"
                    />

                    <FORMTextInput
                      label="Phone Number"
                      name="phone"
                      placeholder="Enter your phone number"
                      required
                    />

                    <FORMTextInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
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
                        onClick={handleCancel}
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