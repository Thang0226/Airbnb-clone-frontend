import { ToastContainer } from 'react-toastify'
import { CContainer, CFooter } from '@coreui/react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import { AdminSideBar } from './AdminSideBar'


const AdminLayout = () => {
  return (
    <div>
      <ToastContainer position="top-right" pauseOnFocusLoss={false} />

      {/* Sidebar */}
      <AdminSideBar/>

      <div
       style={{marginLeft: '63.2px'}}
       className="d-flex flex-column min-h-screen min-vh-100"
      >
        {/* Navbar */}
        <AdminNavBar />

        {/* Content */}
        <CContainer className="p-4 overflow-auto flex-1">
          <Outlet />
        </CContainer>

        {/* Footer */}
        <CFooter className="primary-bg-subtle p-4 mt-auto justify-content-center">
          © 2025 AirBnb Clone Application. Made by TTLD team. All rights reserved.
        </CFooter>
      </div>
    </div>
  )
}

export default AdminLayout