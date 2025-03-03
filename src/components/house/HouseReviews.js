import { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableRow,
} from '@coreui/react'
import Review from './Review'
import { useSelector } from 'react-redux'
import axiosConfig from '../../services/axiosConfig'


export default function HouseReviews() {
  const [reviews, setReviews] = useState([]);
  const house = useSelector((state) => state.houses.house)

  useEffect(() => {
    axiosConfig.get(`/houses/${house.id}/reviews`)
      .then(res => {
        setReviews(res.data)
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <CCard>
      <CCardHeader className="p-0 pt-2 ps-3">
        <h4>Reviews</h4>
      </CCardHeader>
      <CCardBody className="p-0">
        <CTable hover responsive className="mb-0">
          <CTableBody>
            {reviews.map((review) => (
              <CTableRow key={review.id} className="align-middle">
                <Review review={review} />
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}