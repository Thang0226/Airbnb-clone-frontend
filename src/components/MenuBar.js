import {
  CButton,
  CCollapse,
  CContainer, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CForm, CFormInput, CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { TbBrandAirbnb } from 'react-icons/tb'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BASE_URL, BASE_URL_USER } from '../constants/api'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from '../redux/slices/accountSlice'
import { fetchUserProfile } from '../redux/slices/userProfileSlice'

export default function MenuBar() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const username = localStorage.getItem('username')

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username))
    }

  }, [dispatch, username])

  const { userProfile } = useSelector((state) => state.userProfile)

  const handleLogout = async () => {
    await axios.post(
      `${BASE_URL_USER}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(res => {
        toast.success(res.data, { hideProgressBar: true })
        dispatch(resetAccount())
        localStorage.clear()
        navigate('/login')
      })
      .catch(err => {
        toast.error(err.response.data, { hideProgressBar: true })
        navigate('/')
      })
  }

  const handleChangePassword = () => {
    navigate('/user/change-password')
  }

  return (
    <CNavbar expand="lg" className="bg-body-tertiary">
      <CContainer fluid>
        <CNavbarBrand href="#"><TbBrandAirbnb color={'#FF385C'} size={40} /></CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem>
              <CNavLink href="#" active>
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="/#/owner">Airbnb Your Home</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#/admin">
                Admin Dashboard
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
          <CForm className="d-inline-flex">
            <CFormInput type="search" className="me-2" placeholder="Search" />
            <CButton type="submit" color="primary" variant="outline" className="me-5">
              Search
            </CButton>
          </CForm>
          <CDropdown variant="dropdown" popper={true} className="bg-gradient rounded">
            <CDropdownToggle
              caret={false}
              color="primary"
              variant="outline"
              className="d-flex align-items-center gap-2"
              style={{
                borderRadius: '50px',
                height: '48px',
              }}
            >
              <i className="bi bi-list" style={{ fontSize: '1.2rem' }}></i>

              <img
                src={token && userProfile?.avatar
                  ? `${BASE_URL}/images/${userProfile.avatar}`
                  : `${BASE_URL}/images/default.jpg`}
                alt="avatar"
                className="border border-dark"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </CDropdownToggle>
            <CDropdownMenu>
              {token ? (
                <>
                  <CDropdownItem href="/#/profile">Profile</CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem onClick={handleChangePassword} style={{ cursor: 'pointer' }}>
                    Change Password
                  </CDropdownItem>
                  <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    Logout
                  </CDropdownItem>
                </>
              ) : (
                <>
                  <CDropdownItem href="/#/register">Register</CDropdownItem>
                  <CDropdownItem href="/#/login">Login</CDropdownItem>
                </>
              )}
            </CDropdownMenu>
          </CDropdown>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}