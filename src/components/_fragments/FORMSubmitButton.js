import { CButton, CRow } from '@coreui/react'

const SubmitButton = ({ label }) => (
  <CRow className="justify-content-center">
    <CButton color="primary" type="submit" className="w-50 fs-5">
      {label}
    </CButton>
  </CRow>
);

export default SubmitButton;