import { CContainer } from '@coreui/react'
import MenuBar from './MenuBar'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="d-flex flex-column min-h-screen min-vh-100">
      <ToastContainer position="top-right" pauseOnFocusLoss={false} />
      {/* Navbar */}
      <MenuBar />

      {/* Content */}
      <CContainer className="p-3 pt-0 overflow-auto flex-1">
        <Outlet />
      </CContainer>

      {/* Footer */}
      <Footer />
    </div>
  )
}