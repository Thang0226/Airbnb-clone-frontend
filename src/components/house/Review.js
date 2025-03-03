import { CFormTextarea, CTableDataCell } from '@coreui/react'
import { BASE_URL } from '../../constants/api'
import StarRating from '../user/bookings/review/StarRating'
import dayjs from 'dayjs'
import { useState } from 'react'


export default function Review({ review }) {
  const [userImage, setUserImage] = useState(review.userImage);

  return (
    <>
      <CTableDataCell>
        <img
          src={`${BASE_URL}/images/${userImage}`}
          alt="avatar"
          className="border border-white rounded-pill"
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
          }}
          onError={() => setUserImage(`default.jpg`)}
        />
      </CTableDataCell>
      <CTableDataCell>
        <span className="fs-6 fw-bolder">{review.userName}</span><br />
        <span>{dayjs(review.updatedAt).format('DD/MM/YYYY')}</span>
      </CTableDataCell>
      <CTableDataCell className="pt-3">
        <StarRating value={review.rating} disable/>
      </CTableDataCell>
      <CTableDataCell>
        <p className="m-0">{review.comment}</p>
      </CTableDataCell>
    </>
  )
}