import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'


export default function ConfirmHideReview({visible, setVisible, handleHideReview}) {
  return (
    <>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Confirm Hide Review</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to hide this review?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleHideReview}>Confirm</CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}