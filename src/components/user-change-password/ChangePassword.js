import {
  CButton,
  CForm,
  CFormInput,
  CCol,
  CRow,
  CFormLabel, CInputGroupText, CInputGroup, CCard, CCardHeader, CCardBody,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPassword, deletePassword } from '../../redux/slices/accountSlice'
import { BASE_URL_USER } from '../../constants/api'
import FORMPasswordInput from '../_fragments/FORMPasswordInput'
import FORMTextInput from '../_fragments/FORMTextInput'

export default function ChangePassword() {
  const navigate = useNavigate()
  const username = useSelector(state => state.account.username)
  const token = useSelector(state => state.account.token)
  const dispatch = useDispatch()

  const REGEX = {
    password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
  }

  useEffect(() => {
    document.title = 'User | Change Password'
  }, [])

  const initialValues = {
    username: username,
    old_password: '',
    new_password: '',
    confirm_password: ''
  }
  const formikRef = useRef(null)

  const validationSchema = Yup.object().shape({
    old_password: Yup.string()
      .min(6, 'At least 6 characters long')
      .max(32, 'At most 32 characters long')
      .matches(REGEX.password, 'Invalid password'),
    new_password: Yup.string()
      .min(6, 'At least 6 characters long')
      .max(32, 'At most 32 characters long')
      .matches(REGEX.password, 'Invalid password')
      .test("New password", "New password cannot be the same as old password", function (value) {
        return value !== this.parent.old_password;
      }),
    confirm_password: Yup.string()
      .min(6, 'At least 6 characters long')
      .max(32, 'At most 32 characters long')
      .matches(REGEX.password, 'Invalid password')
      .test("Confirm password", "Confirm new password not match", function (value) {
        return value === this.parent.new_password;
      }),
  })

  const handleSubmit = async () => {
    const formValues = formikRef.current.values
    await axios.post(`${BASE_URL_USER}/change_password`, {
      username: username,
      oldPassword: formValues.old_password,
      newPassword: formValues.new_password
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      toast.success(res.data)
      dispatch(setPassword(formValues.new_password))
      navigate('/login')
    }).catch(err => {
      console.log(err)
      toast.error(err.response.data)
      dispatch(deletePassword())
    })
  }

  return (
    <div className="container mt-4">
      <CRow
        xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 2 }}
        className="justify-content-center mt-4"
      >
        <CCol>
          <CCard className="shadow border-0">
            <CCardHeader className="text-center p-4">
              <h3>Change Password</h3>
            </CCardHeader>
            <CCardBody className="p-4">
              <Formik initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                      innerRef={formikRef}>
                {({ handleSubmit }) => (
                  <CForm onSubmit={handleSubmit}>
                    <FORMTextInput
                      label="Username"
                      name="username"
                      disabled
                    />
                    <FORMPasswordInput
                      label="Old Password"
                      name="old_password"
                      placeholder="Enter password"
                      required
                    />
                    <FORMPasswordInput
                      label="New Password"
                      name="new_password"
                      placeholder="Enter password"
                      required
                    />
                    <FORMPasswordInput
                      label="Confirm New Password"
                      name="confirm_password"
                      placeholder="Enter password"
                      required
                    />
                    <CRow className="justify-content-center">
                      <CButton color="primary" type="submit" className="w-auto fs-5">
                        Change password
                      </CButton>
                    </CRow>
                  </CForm>)
                }
              </Formik>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>)
}