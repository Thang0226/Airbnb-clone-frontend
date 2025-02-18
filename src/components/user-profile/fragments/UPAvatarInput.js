import React from 'react'
import { CRow, CCol, CFormInput, CFormFeedback } from '@coreui/react'
import { BASE_URL } from '../../../constants/api'
import { ErrorMessage } from 'formik'

const UPAvatarInput = ({ avatarPreview, userProfile, handleAvatarChange, setFieldValue, setFieldError }) => (
  <CRow className="mb-3 justify-content-center align-items-center">
    <CCol md={2}>
      <img
        src={
          avatarPreview
            ? avatarPreview
            : userProfile.avatar
              ? `${BASE_URL}/images/${userProfile.avatar}`
              : `${BASE_URL}/images/default.jpg`
        }
        alt="Avatar"
        className="rounded-circle border border-white border-3"
        width="100"
        height="100"
        style={{ objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/images/default.jpg'
        }}
      />
    </CCol>
    <CCol md={10} className="ps-3">
      <div style={{minHeight: "24px"}}></div>
      <CFormInput
        name="avatar"
        type="file"
        accept="image/*"
        onChange={(e) => handleAvatarChange(e, setFieldValue, setFieldError)}
      />
      <div
        style={{minHeight: "24px"}}
        className="mt-1"
      >
        <ErrorMessage
          name="avatar"
          component={CFormFeedback}
          className="d-block text-danger ps-2"
        />
      </div>

    </CCol>
  </CRow>
)

export default UPAvatarInput