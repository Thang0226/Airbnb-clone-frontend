import { ToastContainer } from 'react-toastify'
import { CContainer, CFooter } from '@coreui/react'
import { Outlet } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import { AdminSideBar } from './AdminSideBar'
import Footer from '../Footer'


const AdminLayout = () => {
  return (
    <div>
      <ToastContainer position="top-right" pauseOnFocusLoss={false} hideProgressBar={true} />

      {/* Sidebar */}
      <AdminSideBar />

      <div
        style={{ marginLeft: '63.2px' }}
        className="d-flex flex-column min-vh-100 min-vh-100"
      >
        {/* Navbar */}
        <AdminNavBar />

        <CContainer className="p-4 flex-grow-1 overflow-auto">
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