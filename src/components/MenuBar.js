import {
  CCollapse,
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { TbBrandAirbnb } from 'react-icons/tb'
import { useState } from 'react'
import { ROLE_HOST, ROLE_USER } from '../constants/roles'
import UserDropdown from './UserDropdown'

export default function MenuBar() {
  const [visible, setVisible] = useState(false)
  const role = localStorage.getItem('role')

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
            {(role === ROLE_HOST) && (
              <CNavItem>
                <CNavLink href="/#/host">Airbnb Your Home</CNavLink>
              </CNavItem>
            )}
            {(role === ROLE_USER) && (
              <CNavItem>
                <CNavLink href="/#/user/bookings">Booking History</CNavLink>
              </CNavItem>
            )}
          </CNavbarNav>
         <UserDropdown/>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}