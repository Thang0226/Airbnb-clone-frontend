import React from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilHouse, cilUser } from '@coreui/icons'
import { TbBrandAirbnb } from 'react-icons/tb'

export const AdminSideBar = () => {
  return (
    <CSidebar className="border-end" unfoldable>
      <CSidebarHeader className="border-bottom" style={{height:'64px'}}>
        <CSidebarBrand href="#/admin"><TbBrandAirbnb color={'#FF385C'} size={40} /></CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavTitle>Management</CNavTitle>
        <CNavItem href="#/admin/users">
          <CIcon customClassName="nav-icon" icon={cilUser} /> User List
        </CNavItem>
        <CNavItem href="#/admin/hosts">
          <CIcon customClassName="nav-icon" icon={cilHouse} />
          Host List
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  )
}
