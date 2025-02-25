import React from 'react';

const FormatCurrency = ({ value }) => {
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    currencyDisplay: "code",
  }).format(value);
  return <>{formattedValue}</>;
};

export default FormatCurrency;