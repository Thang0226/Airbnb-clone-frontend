import {
  CButton,
  CForm,
  CFormInput,
  CCol,
  CRow,
  CFormLabel, CInputGroupText, CInputGroup,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function ChangePassword() {
  const navigate = useNavigate()
  const username = useSelector(state => state.account.username)
  const token = useSelector(state => state.account.token)
  const dispatch = useDispatch()
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const REGEX = {
    password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
  }

  const initialValues = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  }
  const formikRef = useRef(null)

  useEffect(() => {
    document.title = 'User | Change Password'
  }, [])

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
    <>
      <h2 className={styles.title}>Change Password</h2>
      <Formik initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              innerRef={formikRef}>
        {({ errors, touched, handleChange, handleSubmit }) => (
          <CForm className={styles.formBox} onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="username" className="col-sm-3 col-form-label">
                Username<span style={{color:"red"}}>*</span>
              </CFormLabel>
              <CCol sm={8}>
                <CFormInput type="text" id="username" name="username" value={username} disabled />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="old_password" className="col-sm-3 col-form-label">
                Old Password<span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm={8}>
              <CInputGroup>
                  <CFormInput
                    type={showOldPassword ? "text" : "password"}
                    id="old_password"
                    name="old_password"
                    onChange={handleChange}
                    required
                  />
                  <CInputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowOldPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
                  </CInputGroupText>
                </CInputGroup>
                {touched.old_password && errors.old_password &&
                  <p className={styles.error}>{errors.old_password}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="new_password" className="col-sm-3 col-form-label">
                New Password<span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm={8}>
              <CInputGroup>
                  <CFormInput
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    name="new_password"
                    onChange={handleChange}
                    required
                  />
                  <CInputGroupText
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </CInputGroupText>
                </CInputGroup>
                {touched.new_password && errors.new_password &&
                  <p className={styles.error}>{errors.new_password}</p>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="confirm_password" className="col-sm-3 col-form-label">
                Confirm New Password<span style={{ color: 'red' }}>*</span>
              </CFormLabel>
              <CCol sm={8}>
              <CInputGroup>
                  <CFormInput
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
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
                  <p className={styles.error}>{errors.confirm_password}</p>}
              </CCol>
            </CRow>
            <CRow className="justify-content-center">
              <CButton color="primary" type="submit" className="w-25">
                Change password
              </CButton>
            </CRow>
          </CForm>)
        }
      </Formik>
    </>
  )
}