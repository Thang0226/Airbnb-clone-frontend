import {
  CButton,
  CForm,
  CFormInput,
  CCol,
  CRow,
  CFormLabel, CFormCheck, CInputGroup, CInputGroupText,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUsername, setPassword } from '../../redux/slices/accountSlice'
import { BASE_URL_USER } from '../../constants/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const REGEX = {
    username: /^[a-zA-Z0-9_]{4,30}$/,
    password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
    phone: /^0[0-9]{9}$/,
  }

  const initialValues = {
    username: '',
    phone: '',
    password: '',
    confirm_password: '',
    isHost: false,
  }
  const formikRef = useRef(null)

  useEffect(() => {
    document.title = 'Airbnb | Register'
  }, [])

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, 'At least 4 characters long')
      .max(30, 'At most 30 characters long')
      .matches(REGEX.username, 'Not contain special characters')
      .test('Duplicate username', 'Username already exists', async function(value) {
        if (!value) return true
        try {
          await axios.post(`${BASE_URL_USER}/register/validate-username`, value,
            {
              headers: {
                'Content-Type': 'text/plain',
              },
            })
          return true
        } catch (error) {
          // console.log(error)
          return false
        }
      }),
    phone: Yup.string()
      .matches(REGEX.phone, 'Invalid phone number')
      .test('Duplicate phone number', 'Phone number already exists', async function(value) {
        if (!value) return true
        try {
          await axios.post(`${BASE_URL_USER}/register/validate-phone`, value,
            {
              headers: {
                'Content-Type': 'text/plain',
              },
            })
          return true
        } catch (error) {
          // console.log(error)
          return false
        }
      }),
    password: Yup.string()
      .min(6, 'At least 6 characters long')
      .max(32, 'At most 32 characters long')
      .matches(REGEX.password, 'Invalid password'),
    confirm_password: Yup.string()
      .test(
        'Same passwords',
        'Passwords must match',
        function(value) {
          return this.parent.password === value
        },
      ),


    isHost: Yup.boolean(),
  })

  const handleSubmit = async () => {
    const formValues = formikRef.current.values
    console.log('Form Values:', formValues)
    try {
      await axios.post(`${BASE_URL_USER}/register`, {
        username: formValues.username,
        password: formValues.password,
        phone: formValues.phone,
        host: formValues.isHost,
      })
      dispatch(setUsername(formValues.username))
      dispatch(setPassword(formValues.password))

      if (formValues.isHost) {
        toast.info('Your host request has been submitted for review!', { hideProgressBar: true })
      } else {
        toast.success('Registered successfully!', { hideProgressBar: true })
      }
      navigate('/login')
    } catch (error) {
      console.log(error);
      toast.error('Registration failed!', { hideProgressBar: true })

    }
  }

  return (
    <>
      <h2 className={styles.title}>Register New Account</h2>
      <Formik initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              innerRef={formikRef}>
        {({ errors, touched, handleChange, handleSubmit, values }) => (
          <CForm className={styles.formBox} onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="username" className="col-sm-4 col-form-label">
                Username:
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" placeholder="Enter username" id="username" name="username"
                            onChange={handleChange} required />
                {touched.username && errors.username &&
                  <p className="text-warning-emphasis">{errors.username}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="phone" className="col-sm-4 col-form-label">
                Phone:
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" placeholder="0123456789" id="phone" name="phone"
                            onChange={handleChange}
                            required />
                {touched.phone && errors.phone && <p className="text-warning-emphasis">{errors.phone}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="password" className="col-sm-4 col-form-label">
                Password:
              </CFormLabel>
              <CCol sm={8}>
                <CInputGroup>
                  <CFormInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                  <CInputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </CInputGroupText>
                </CInputGroup>
                {touched.password && errors.password &&
                  <p className={styles.error}>{errors.password}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-4">
              <CFormLabel htmlFor="confirm_password" className="col-sm-4 col-form-label">
                Confirm Password:
              </CFormLabel>
              <CCol sm={8}>
                <CInputGroup>
                  <CFormInput
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                  <CInputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </CInputGroupText>
                </CInputGroup>
                {touched.confirm_password && errors.confirm_password &&
                  <p className="text-warning-emphasis">{errors.confirm_password}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-4">
                <CFormCheck
                  id="isHost"
                  name="isHost"
                  label="Register as a Host"
                  checked={values.isHost}
                  onChange={handleChange}
                />
            </CRow>
            <CRow className="justify-content-center">
              <CButton color="primary" type="submit" className="w-25">
                Register
              </CButton>
            </CRow>
          </CForm>)
        }
      </Formik>
    </>
  )

}