import {
  CForm,
  CCol,
  CRow,
  CCard, CCardHeader, CCardBody
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUsername, deletePassword, setRole } from '../../redux/slices/accountSlice'
import { BASE_URL_USER } from '../../constants/api'
import FORMTextInput from '../_fragments/FORMTextInput'
import FORMPasswordInput from '../_fragments/FORMPasswordInput'
import SubmitButton from '../_fragments/FORMSubmitButton'
import SocialLoginComponent from './SocialLogin'
import { ROLE_ADMIN, ROLE_HOST } from '../../constants/roles'
import { loginSetup, logoutAPI } from '../../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const registeredUsername = useSelector(state => state.account.username)
  const registeredPassword = useSelector(state => state.account.password)
  const dispatch = useDispatch()
  const REGEX = {
    username: /^[a-zA-Z0-9_]{4,30}$/,
    password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
  }

  const initialValues = {
    username: registeredUsername,
    password: registeredPassword,
  }

  useEffect(() => {
    document.title = 'Airbnb | Login';
    if (localStorage.getItem('loggedIn')) {
      navigate('/')
    }
  }, [])

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(4, 'At least 4 characters long')
      .max(30, 'At most 30 characters long')
      .matches(REGEX.username, 'Username must not contain special characters'),
    password: Yup.string()
      .min(6, 'At least 6 characters long')
      .max(32, 'At most 32 characters long')
      .matches(REGEX.password, 'Invalid password'),
  })

  const handleSubmit = async (values) => {
    await axios.post(`${BASE_URL_USER}/login`, {
      username: values.username,
      password: values.password,
    })
      .then(async (res) => {
        const user = res.data;
        localStorage.setItem("token", user.token);
        if (user.userStatus === 'LOCKED') {
          await logoutAPI()
          toast.warning("Your account has been LOCKED, please contact Admin.", { hideProgressBar: true })
          return navigate('/login');
        }
        const role = user.authorities[0].authority;
        dispatch(setUsername(user.username))
        dispatch(setRole(role))
        dispatch(deletePassword())
        await loginSetup(user, role)
        if (role === ROLE_ADMIN) {
          return navigate('/admin');
        }
        if (role === ROLE_HOST) {
          return navigate('/host');
        }
        navigate('/')
      })
      .catch((err) => {
        toast.error(err.response.data, { hideProgressBar: true })
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
                <h3>Login</h3>
              </CCardHeader>
              <CCardBody className="p-4">
                <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                  {({ handleSubmit }) => (
                    <CForm onSubmit={handleSubmit}>
                      <FORMTextInput
                        label="Username"
                        name="username"
                        placeholder="Enter username"
                      />
                      <FORMPasswordInput
                        label="Password"
                        name="password"
                        placeholder="Enter password"
                      />
                      <SubmitButton
                        label="Login"
                      />
                      <CRow className="mb-3 mt-3">
                        <CCol className="d-flex justify-content-center fs-6">
                          Don't have an account?
                          <Link to="/register" style={{textDecoration: "none"}}> Register</Link>
                        </CCol>
                      </CRow>
                      <hr/>
                      <CRow>
                        <CCol className="d-flex justify-content-center">
                          <SocialLoginComponent/>
                        </CCol>
                      </CRow>
                    </CForm>
                  )
                  }
                </Formik>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
  )
}