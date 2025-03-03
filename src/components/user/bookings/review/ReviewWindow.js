import { useState } from 'react'
import { CButton, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import StarRating from './StarRating'
import { BASE_URL } from '../../../../constants/api'


export default function ReviewWindow({visible, setVisible, bookingInfo, handleAfterConfirm}) {

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [customerImage, setCustomerImage] = useState(bookingInfo.customerImage);

  const handleConfirm = () => {
    handleAfterConfirm(rating, comment);
  }

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">How was your stay?</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <img
          src={`${BASE_URL}/images/${customerImage}`}
          alt="avatar"
          className="border border-white rounded-pill"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
          }}
          onError={() => setCustomerImage(`default.jpg`)}
        />
        <span className="ms-2 fs-6 fw-bolder">{bookingInfo.customerName}</span>
        <StarRating value={rating} onChange={(index) => setRating(index)} />
        <CFormTextarea
          name="message"
          placeholder="Give your comment..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton color="primary" onClick={handleConfirm}>Send Review</CButton>
      </CModalFooter>
    </CModal>
  )
}