import {
  CCol,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { ErrorMessage, Field } from 'formik'
import { useState } from 'react'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function FORMPasswordInput ({
                         label = "",
                         name = "",
                         required = false,
                         readOnly = false,
                         disabled = false,
                         placeholder = ""
                       }) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <CRow className="mb-3">
      <CCol md={12}>
        <CInputGroup className="position-relative">
          <div className="form-floating flex-grow-1">
            <Field
              name={name}
              as={CFormInput}
              type={showPassword ? "text" : "password"}
              id={name}
              placeholder={placeholder}
              className="form-control pe-5 rounded"
              readOnly={readOnly}
              disabled={disabled}
              style={readOnly ? {cursor: "not-allowed"} : {}}
            />
            <CFormLabel htmlFor={name}>
              {label} {required && <span style={{color: 'red'}}>*</span>}
            </CFormLabel>
          </div>
          <CInputGroupText
            className="position-absolute end-0 h-100 border-start-0 rounded-end"
            style={{ cursor: "pointer", zIndex: 5, marginLeft: '-10px' }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </CInputGroupText>
        </CInputGroup>
        <div style={{minHeight: "20px"}} className="mt-1">
          <ErrorMessage
            name={name}
            component={CFormFeedback}
            className="d-block text-warning ps-2"
          />
        </div>
      </CCol>
    </CRow>
  );
}