import React from 'react'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilList, cilUser } from '@coreui/icons'
import { TbBrandAirbnb } from 'react-icons/tb'

export const AdminSideBar = () => {
  return (
    <CSidebar className="border-end" unfoldable>
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand href="#/admin"><TbBrandAirbnb color={'#FF385C'} size={40} /></CSidebarBrand>
      </CSidebarHeader>
      <CSidebarNav>
        <CNavTitle>Management</CNavTitle>
        <CNavItem href="#/admin/users">
          <CIcon customClassName="nav-icon" icon={cilUser} /> User List
        </CNavItem>
        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilList} /> Host
            </>
          }
        >
          <CNavItem href="#">
            <CIcon customClassName="nav-icon" icon={cilUser} />
            Host List
          </CNavItem>
          <CNavItem href="/#/admin/host/request">
            <span className="nav-icon">
              <i className="bi bi-card-checklist"></i>
            </span>{' '}
            Host Request
          </CNavItem>
        </CNavGroup>
        <CNavItem href="https://coreui.io">
          <CIcon customClassName="nav-icon" icon={cilCloudDownload} /> Download CoreUI
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  )
}
