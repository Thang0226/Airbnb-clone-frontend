import { CContainer , CFooter } from '@coreui/react'
import MenuBar from './MenuBar'
import { ToastContainer } from 'react-toastify'

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-h-screen min-vh-100">
      <ToastContainer position="top-right" pauseOnFocusLoss={false} />
      {/* Navbar */}
      <MenuBar />

      {/* Content */}
      <CContainer className="p-4 overflow-auto flex-1">{children}</CContainer>

      {/* Footer */}
      <CFooter className="primary-bg-subtle p-4 mt-auto justify-content-center">
        © 2025 AirBnb Clone Application. Made by TTLD team. All rights reserved.
      </CFooter>
    </div>
  )
}
