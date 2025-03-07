import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import MenuBar from '../../MenuBar'
import Footer from '../../Footer'

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

        <Footer />
      </div>
    </div>

  )
}

export default HostLayout