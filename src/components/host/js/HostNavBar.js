import {
  CCollapse,
  CContainer, CDropdown, CDropdownDivider, CDropdownItem, CDropdownMenu, CDropdownToggle,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { TbBrandAirbnb } from 'react-icons/tb'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../../constants/api'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from '../../../redux/slices/accountSlice'
import { fetchUserProfile } from '../../../redux/slices/userProfileSlice'
import { logout } from '../../../services/authService'

export default function HostNavBar() {
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
    try {
      const message = await logout()
      toast.success(message, { hideProgressBar: true })
      dispatch(resetAccount())
      localStorage.clear()
      navigate('/login')
    } catch (err) {
      console.log(err)
      toast.error(err.response.data || err.message, { hideProgressBar: true })
    }
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
              <CNavLink href="/#/host">Airbnb Your Home</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="/#/houses">Houses</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="/#/host/bookings">Booking</CNavLink>
            </CNavItem>
          </CNavbarNav>
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
                  <CDropdownItem href="/#/host/profile">Profile</CDropdownItem>
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