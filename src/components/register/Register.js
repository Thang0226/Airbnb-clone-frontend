import {
  CForm,
  CCol,
  CRow,
  CFormCheck, CCard, CCardHeader, CCardBody,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUsername, setPassword } from '../../redux/slices/accountSlice'
import { BASE_URL_USER } from '../../constants/api'
import FORMTextInput from '../_fragments/FORMTextInput'
import FORMPasswordInput from '../_fragments/FORMPasswordInput'
import SubmitButton from '../_fragments/FORMSubmitButton'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const REGEX = {
    username: /^[a-zA-Z0-9_]{4,30}$/,
    password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
    email: /^[a-z0-9._%+]+@[a-z0-9_]+\.[a-z]{2,5}$/,
    phone: /^0[0-9]{9}$/,
  }

  const initialValues = {
    username: '',
    phone: '',
    password: '',
    confirm_password: '',
    isHost: false,
  }

  useEffect(() => {
    document.title = 'Airbnb | Register';
    if (localStorage.getItem('loggedIn')) {
      navigate('/')
    }
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
          console.log(error)
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
    email: Yup.string()
      .matches(REGEX.email, 'Invalid email address')
      .test('Duplicate email', 'Email already existed', async function(value) {
        if (!value) return true
        try {
          await axios.post(`${BASE_URL_USER}/register/validate-email`, value,
            {
              headers: {
                'Content-Type': 'text/plain',
              },
            })
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      }),
  })

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${BASE_URL_USER}/register`, {
        username: values.username,
        password: values.password,
        phone: values.phone,
        email: values.email,
        host: values.isHost,
      })
      dispatch(setUsername(values.username))
      dispatch(setPassword(values.password))
      console.log(values)
      if (values.isHost) {
        toast.info('Your host request has been submitted for review!', { hideProgressBar: true })
      } else {
        toast.success('Registered user successfully!', { hideProgressBar: true })
      }
      navigate('/login')
    } catch (error) {
      console.log(error);
      toast.error('Registration failed!', { hideProgressBar: true })
    }
  }

  return (
      <div className="container mt-0">
        <CRow
          xs={{ cols: 1 }} md={{ cols: 1 }} lg={{ cols: 2 }}
          className="justify-content-center mt-0"
        >
          <CCol>
            <CCard className="shadow border-0">
              <CCardHeader className="text-center p-4">
                <h3>Register New Account</h3>
              </CCardHeader>
              <CCardBody className="p-4">
                <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                  {({ values, handleChange, handleSubmit }) => (
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
                      <FORMPasswordInput
                        label="Confirm Password"
                        name="confirm_password"
                        placeholder="Enter confirm password"
                      />
                      <FORMTextInput
                        label="Phone"
                        name="phone"
                        placeholder="0123456789"
                        required
                      />
                      <FORMTextInput
                        label="Email"
                        name="email"
                        placeholder="user@email.com"
                        required
                      />
                      <CRow className="m-auto mb-4">
                        <CFormCheck
                          id="isHost"
                          name="isHost"
                          label="Register as a Host"
                          checked={values.isHost}
                          onChange={handleChange}
                        />
                      </CRow>
                      <SubmitButton
                        label="Register"
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