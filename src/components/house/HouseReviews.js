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
import { FaStar } from 'react-icons/fa'


export default function HouseReviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState('');
  const house = useSelector((state) => state.houses.house)

  const getAverageRating = (reviewList) => {
    const sum = reviewList.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    let average = sum / reviewList.length;
    setAverageRating(average.toFixed(1));
  }

  useEffect(() => {
    axiosConfig.get(`/houses/${house.id}/reviews`)
      .then(res => {
        setReviews(res.data)
        getAverageRating(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center p-0 pt-2 px-3">
        <h4>Reviews</h4>
        <div className="d-flex align-items-center mb-2">
          <FaStar size={25} color="#ffa500" />
          <span className="ms-2 fs-5">{averageRating}</span>
        </div>
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