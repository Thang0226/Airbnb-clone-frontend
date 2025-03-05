import { ToastContainer } from 'react-toastify'
import { CContainer } from '@coreui/react'
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
        className="d-flex flex-column min-h-screen min-vh-100"
      >
        {/* Navbar */}
        <AdminNavBar />

        {/* Content */}
        <CContainer className="p-4 overflow-auto flex-1">
          <Outlet />
        </CContainer>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default AdminLayout