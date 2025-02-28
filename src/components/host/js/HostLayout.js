import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { CContainer, CFooter } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import MenuBar from '../../MenuBar'

function HostLayout() {

  useEffect(() => {
    document.title = 'Airbnb | Host'
  }, [])

  return (
    <div>
      <ToastContainer position="top-right" pauseOnFocusLoss={false} hideProgressBar={true} />
      <div
        className="d-flex flex-column min-h-screen min-vh-100"
      >
        <MenuBar />

        <CContainer className="p-4 overflow-auto flex-1">
          <Outlet />
        </CContainer>

        <CFooter className="primary-bg-subtle p-4 mt-auto justify-content-center">
          © 2025 AirBnb Clone Application. Made by TTLD team. All rights reserved.
        </CFooter>
      </div>
    </div>

  )
}

export default HostLayout