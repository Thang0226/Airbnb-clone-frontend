import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody, CTableDataCell,
  CTableRow,
} from '@coreui/react'
import Review from './Review'
import { useSelector } from 'react-redux'
import axiosConfig from '../../services/axiosConfig'
import { FaStar } from 'react-icons/fa'
import { UserPagination} from '../_fragments/CustomerPagination'
import { REVIEWS_PAGE_SIZE } from '../../constants/pageSize'


export default function HouseReviews({canHideReview = false}) {
  const [reviews, setReviews] = useState([]);
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
    console.log(reviewList);
    console.log(totalPages);
  }

  useEffect(() => {
    axiosConfig.get(`/houses/${house.id}/reviews`)
      .then(res => {
        const reviewList = res.data;
        setReviews(reviewList);
        getAverageRating(reviewList);
        setUpPagination(reviewList);
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
    console.log(startIndex);
    console.log(startIndex + pageSize);
    let list = reviews.slice(startIndex, startIndex + pageSize);
    console.log(list);
    setPageReviewList(list);
  }

  const hideReview = () => {}

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
            {pageReviewList.map((review) => (
              <CTableRow key={review.id} className="align-middle">
                <Review review={review} />
                {canHideReview && (
                  <CTableDataCell>
                    <CButton color="warning" onClick={() => hideReview(review.id)}>Hide</CButton>
                  </CTableDataCell>
                )}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {reviews && reviews.length > 0 &&
          <UserPagination page={page} totalPages={totalPages} setPage={changePage} />}
      </CCardBody>
    </CCard>
  )
}