import Pagination from 'react-bootstrap/Pagination';
import React from 'react';

export const UserPagination = ({ page, totalPages, setPage }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Pagination className="mt-3 justify-content-center">
      <Pagination.First onClick={() => handlePageChange(0)} disabled={page === 0} />
      <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />

      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item key={index} active={index === page} onClick={() => handlePageChange(index)}>
          {index + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1} />
      <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={page === totalPages - 1} />
    </Pagination>
  );
};
