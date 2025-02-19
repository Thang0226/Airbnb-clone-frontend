import React from 'react'
import { CRow, CCol, CFormInput, CFormFeedback } from '@coreui/react'
import { BASE_URL } from '../../../constants/api'
import { ErrorMessage } from 'formik'

const UPAvatarInput = ({ avatarPreview, userProfile, handleAvatarChange, setFieldValue }) => (
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
      />
    </CCol>
    <CCol md={10} className="ps-3">
      <div style={{minHeight: "24px"}} className="ps-2 mb-1">
        Maximum file size is 5MB. Only accepts JPG, JPEG, PNG.
      </div>
      <CFormInput
        type="file"
        name="avatar"
        id="avatar"
        accept="image/*"
        onChange={(e) => handleAvatarChange(e, setFieldValue)}
      />
      <div
        style={{ minHeight: '24px' }}
        className="mt-1"
      >
        <ErrorMessage
          name="avatar"
          component={CFormFeedback}
          className="d-block text-warning ps-2"
        />
      </div>

    </CCol>
  </CRow>
)

export default UPAvatarInput