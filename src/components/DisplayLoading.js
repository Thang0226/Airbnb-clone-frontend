import { CSpinner } from '@coreui/react'
import React from 'react'

export const DisplayLoading = ({message}) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center w-100">
      <CSpinner color="primary" size="lg" />
      <h1 className="mt-3">{message}</h1>
    </div>
  )
}