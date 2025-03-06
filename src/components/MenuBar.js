import {
  CBadge ,
  CCollapse ,
  CContainer , CDropdown , CDropdownMenu , CDropdownToggle , CLink ,
  CNavbar ,
  CNavbarBrand ,
  CNavbarNav ,
  CNavbarToggler ,
  CNavItem ,
  CNavLink ,
} from '@coreui/react'
import { TbBrandAirbnb } from 'react-icons/tb'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ROLE_HOST , ROLE_USER } from '../constants/roles'
import UserDropdown from './UserDropdown'
import { IoNotifications } from 'react-icons/io5'
import Notifications from './host/js/Notifications'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cibMessenger } from '@coreui/icons'
import MessageBadge from './MessageBadge'

export default function MenuBar() {
  const [visible , setVisible] = useState ( false )
  const navigate = useNavigate ()
  const role = useSelector ( state => state.account.role )
  const username = useSelector ( state => state.account.username )
  const [isHovered , setIsHovered] = useState ( false )
  const currentUser = useSelector ( (state) => ({
    id: localStorage.getItem ( 'userId' ) ,
    username: localStorage.getItem ( 'username' ) ,
    role: localStorage.getItem ( 'role' ) ,
  }) )

  return (
    <CNavbar expand="lg" className="bg-body-tertiary">
      <CContainer fluid>
        <CNavbarBrand href="#"><TbBrandAirbnb color={'#FF385C'} size={40} /></CNavbarBrand>
        <CNavbarToggler onClick={() => setVisible ( !visible )} />
        <CCollapse className="navbar-collapse" visible={visible}>
          <CNavbarNav className="me-auto">
            <CNavItem>
              <CNavLink href="#" active>
                Home
              </CNavLink>
            </CNavItem>
            {(role === ROLE_HOST) && (
              <>
                <CNavItem className="border-end">
                  <CNavLink href="/#/host">Airbnb Your Home</CNavLink>
                </CNavItem>
                <CNavItem className="border-end">
                  <CNavLink style={{ cursor: 'pointer' }}
                            onClick={() => navigate ( '/host/houses' , { state: { username: username } } )}
                  >Houses</CNavLink>
                </CNavItem>
                <CNavItem className="border-end">
                  <CNavLink href="/#/host/bookings">Booking</CNavLink>
                </CNavItem>
                <CNavItem className="border-end">
                  <CNavLink href="/#/host/earnings">Earnings</CNavLink>
                </CNavItem>
                <CNavItem className="border-end">
                  <CNavLink href="/#/host/messenger">Messages</CNavLink>
                </CNavItem>
              </>
            )}
            {(role === ROLE_USER) && (
              <>
                <CNavItem>
                  <CNavLink href="/#/user/bookings">Booking History</CNavLink>
                </CNavItem>
              </>
            )}
          </CNavbarNav>

          {(role === ROLE_HOST) && (
            <CDropdown variant="dropdown" popper={true} className="bg-gradient rounded me-2">
              <CDropdownToggle
                caret={false}
                color="success"
                variant="outline"
                className="d-flex align-items-center gap-2"
                style={{
                  borderRadius: '50px' ,
                  height: '48px' ,
                }}
              >
                <IoNotifications size={25} />
              </CDropdownToggle>
              <CDropdownMenu className="py-0">
                <Notifications hostUsername={username} />
              </CDropdownMenu>
            </CDropdown>
          )}
          <UserDropdown />
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}