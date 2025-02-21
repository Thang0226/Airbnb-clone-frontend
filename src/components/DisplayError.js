import { CCol, CRow } from '@coreui/react'
import React from 'react'

export const DisplayError = ({error}) => {
  return (
    <div className="container mt-4">
      <CRow className="mt-4">
        <CCol md={6}>
          <h1 className="text-danger">Lỗi: {error}</h1>
        </CCol>
      </CRow>
    </div>
  )
}