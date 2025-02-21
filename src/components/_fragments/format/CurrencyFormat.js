import React from 'react';

const FormatCurrency = ({ value }) => {
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
  return <>{formattedValue}</>;
};

export default FormatCurrency;