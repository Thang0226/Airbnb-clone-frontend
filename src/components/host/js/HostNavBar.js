import {
  CCollapse,
  CContainer, CDropdown, CDropdownMenu, CDropdownToggle,
  CNavbar,
  CNavbarBrand,
  CNavbarNav,
  CNavbarToggler,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import { TbBrandAirbnb } from 'react-icons/tb'
import { IoNotifications } from "react-icons/io5";
import { useState } from 'react'
import Notifications from './Notifications'
import UserDropdown from '../../UserDropdown'

export default function HostNavBar() {
  const [visible, setVisible] = useState(false)
  const username = localStorage.getItem('username')

  return (
    <CNavbar expand="lg" className="bg-body-tertiary">
      <CContainer fluid>
        <CNavbarBrand href="#"><TbBrandAirbnb color={'#FF385C'} size={40} /></CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible(!visible)} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem className="border-end">
              <CNavLink href="#" active>
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem className="border-end">
              <CNavLink href="/#/host">Airbnb Your Home</CNavLink>
            </CNavItem>
            <CNavItem className="border-end">
              <CNavLink href="/#/host/houses">Houses</CNavLink>
            </CNavItem>
            <CNavItem className="border-end">
              <CNavLink href="/#/host/bookings">Booking</CNavLink>
            </CNavItem>
            <CNavItem className="border-end">
              <CNavLink href="/#/host/earnings">Earnings</CNavLink>
            </CNavItem>
          </CNavbarNav>
          <CDropdown variant="dropdown" popper={true} className="bg-gradient rounded me-2">
            <CDropdownToggle
              caret={false}
              color="success"
              variant="outline"
              className="d-flex align-items-center gap-2"
              style={{
                borderRadius: '50px',
                height: '48px',
              }}
            >
              <IoNotifications size={25}/>
            </CDropdownToggle>
            <CDropdownMenu className="py-0">
              <Notifications hostUsername={username}/>
            </CDropdownMenu>
          </CDropdown>
          <UserDropdown/>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}