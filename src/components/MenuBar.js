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
import { BASE_URL_USER } from '../constants/api'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetAccount } from '../redux/slices/accountSlice'

export default function MenuBar() {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const token = useSelector(state => state.account.token)
  const dispatch = useDispatch()

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
        navigate('/login')
      })
      .catch(err => {
        toast.error(err.response.data, { hideProgressBar: true })
      })
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
              <CNavLink href="#">Airbnb Your Home</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#" disabled>
                Disabled
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
          <CForm className="d-inline-flex">
            <CFormInput type="search" className="me-2" placeholder="Search" />
            <CButton type="submit" color="primary" variant="outline" className="me-5">
              Search
            </CButton>
          </CForm>
          <CDropdown variant="dropdown" popper={true}>
            <CDropdownToggle color="secondary">User</CDropdownToggle>
            <CDropdownMenu>
              {token ? (
                <>
                  <CDropdownItem href="/#/profile">Profile</CDropdownItem>
                  <CDropdownDivider />
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