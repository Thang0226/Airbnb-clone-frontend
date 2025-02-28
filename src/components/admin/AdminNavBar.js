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
import { useState } from 'react'
import UserDropdown from '../UserDropdown'

export default function AdminNavBar() {
  const [visible, setVisible] = useState(false)

  return (
    <CNavbar expand="lg" className="bg-body-tertiary">
      <CContainer fluid>
        <CNavbarBrand></CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem>
            </CNavItem>
          </CNavbarNav>
          <UserDropdown/>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}