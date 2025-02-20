import {
  CForm,
  CCol,
  CRow,
  CCard, CCardHeader, CCardBody,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUsername, deletePassword } from '../../redux/slices/accountSlice'
import { BASE_URL_USER } from '../../constants/api'
import FORMTextInput from '../_fragments/FORMTextInput'
import FORMPasswordInput from '../_fragments/FORMPasswordInput'
import SubmitButton from '../_fragments/FORMSubmitButton'

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
    username: '',
    password: '',
  }
  const formikRef = useRef(null)

  useEffect(() => {
    document.title = 'Airbnb | Login'
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

  const handleSubmit = async () => {
    const formValues = formikRef.current.values
    await axios.post(`${BASE_URL_USER}/login`, {
      username: formValues.username || registeredUsername,
      password: formValues.password || registeredPassword,
    })
      .then((res) => {
        const user = res.data;
        const role = user.authorities[0].authority;
        dispatch(setToken(user.token))
        dispatch(setUsername(user.username))
        dispatch(deletePassword())
        localStorage.setItem('token', user.token)
        localStorage.setItem('loggedIn', JSON.stringify(true))
        localStorage.setItem('username', user.username)
        localStorage.setItem('role', role)
        toast.success('login successful', { hideProgressBar: true })
        if (role === 'ROLE_ADMIN') {
          return navigate('/admin');
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
                        onSubmit={handleSubmit}
                        innerRef={formikRef}>
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
                    </CForm>)
                  }
                </Formik>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
  )
}