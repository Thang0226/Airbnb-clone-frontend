import { CSpinner } from '@coreui/react'
import React from 'react'

export const DisplayLoading = ({message}) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 w-100 h-100"
      style={{ zIndex: -1 }}
    >
      <CSpinner color="primary" size="lg" />
      <h1 className="mt-3">{message}</h1>
    </div>
  )
}