import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { REVIEWS_PAGE_SIZE } from '../../../constants/pageSize'
import axiosConfig from '../../../services/axiosConfig'
import { toast } from 'react-toastify'
import { CButton, CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableRow } from '@coreui/react'
import { FaStar } from 'react-icons/fa'
import Review from '../../house/Review'
import { UserPagination } from '../../_fragments/CustomerPagination'
import ConfirmHideReview from '../../modals/ConfirmHideReview'

export default function HostHouseReviews() {
  const [hideReviewVisible, setHideReviewVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(0);
  const [averageRating, setAverageRating] = useState('');
  const house = useSelector((state) => state.houses.house);
  const [totalPages, setTotalPages] = useState(1);
  const [pageReviewList, setPageReviewList] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = REVIEWS_PAGE_SIZE;

  const getAverageRating = (reviewList) => {
    const sum = reviewList.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    let average = sum / reviewList.length;
    setAverageRating(average.toFixed(1));
  }

  const setUpPagination = (reviewList) => {
    let length = reviewList.length;
    let totalPages = Math.ceil(length / pageSize);
    setTotalPages(totalPages);
  }

  const getReviews = async () => {
    try {
      const res = await axiosConfig.get(`/houses/${house.id}/reviews?hidden=0`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getReviews()
      .then(reviews => {
        setReviews(reviews);
        getAverageRating(reviews);
        setUpPagination(reviews);
      })
      .catch(err => console.log(err));
  }, [house]);

  useEffect(() => {
    changePage(0);
  }, [reviews]);

  const changePage = (page) => {
    if (page < 0 || page > totalPages) {
      console.error('Wrong page');
      return;
    }
    setPage(page);
    // Perform table review list change on the full list
    let startIndex = page * pageSize;
    let list = reviews.slice(startIndex, startIndex + pageSize);
    setPageReviewList(list);
  }

  const confirmHideReview = async (id) => {
    setSelectedReviewId(id)
    setHideReviewVisible(true);
  }

  const handleHideReview = async () => {
    await axiosConfig.patch(`/reviews/${selectedReviewId}/hide`)
      .then(res => {
        toast.info("Hidden review");
        setHideReviewVisible(false);
        getReviews().then(reviews => {
          setReviews(reviews);
        })
      }).catch(err => console.log(err));
  }

  return (
    <CCard className="mt-3">
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
            {pageReviewList.map((review) => (
              <CTableRow key={review.id} className="align-middle">
                  <Review review={review} />
                  <CTableDataCell>
                    <CButton color="warning" disabled={review.hidden} style={{width: '80px'}}
                             onClick={() => confirmHideReview(review.id)}>
                      {review.hidden ? "Hidden" : "Hide"}
                    </CButton>
                  </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {reviews && reviews.length > 0 &&
          <UserPagination page={page} totalPages={totalPages} setPage={changePage} />}
      </CCardBody>
      <ConfirmHideReview visible={hideReviewVisible} setVisible={setHideReviewVisible} handleHideReview={handleHideReview} />
    </CCard>
  )
}