import {
  CButton,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useState } from 'react'


export default function ConfirmWindow({visible, setVisible, title, label, handleAfterConfirm}) {

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleConfirm = () => {
    setMessage('')
    // setVisible(false)
    handleAfterConfirm(message);
  }

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormTextarea
          name="message"
          label={label}
          placeholder="Enter your message..."
          rows={3}
          value={message}
          onChange={handleChange}
          />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleConfirm}>Confirm</CButton>
      </CModalFooter>
    </CModal>
  )
}