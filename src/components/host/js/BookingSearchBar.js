import { useEffect, useState } from 'react'
import { CButton, CCol, CFormInput, CFormSelect, CRow } from '@coreui/react'

const BookingSearchBar = ({onSearch, searchData}) => {
  const [houseName, setHouseName] = useState(searchData.houseName || '');
  const [startDate, setStartDate] = useState(searchData.startDate || '');
  const [endDate, setEndDate] = useState(searchData.endDate || '');
  const [status, setStatus] = useState(searchData.status || '');

  useEffect(() => {
    setHouseName(searchData.houseName || '');
    setStartDate(searchData.startDate || '');
    setEndDate(searchData.endDate || '');
    setStatus(searchData.status || '');
  }, [searchData]); // Cập nhật khi searchData thay đổi

  const handleSearch = () => {
    if (!houseName && !startDate && !endDate && !status) return
    onSearch({ houseName, startDate, endDate, status });
  };

  return (
    <CRow className="justify-content-center">
      <CCol sm={12} md={8} lg={3} className="mt-2">
        <div className="d-flex flex-column flex-grow-1">
          <label className="fw-bolder ps-1">Address</label>
          <CFormInput
            type="text"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            className="ps-2 pt-2"
            placeholder="Enter house name"
          />
        </div>
      </CCol>
      <CCol sm={12} md={4} lg={2} className="mt-2">
        <div className="d-flex flex-column flex-grow-1">
          <label className="fw-bolder ps-1">Status</label>
          <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Choose Status</option>
            <option value="WAITING">WAITING</option>
            <option value="CHECKED_IN">CHECKED IN</option>
            <option value="CHECKED_OUT">CHECKED OUT</option>
            <option value="CANCELED">CANCELED</option>
          </CFormSelect>
        </div>
      </CCol>
      <CCol sm={12} md={5} lg={3} className="mt-2">
        <div className="d-flex flex-column flex-grow-1">
          <label className="fw-bolder ps-1">Start Date</label>
          <CFormInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ps-2 pt-2"
          />
        </div>
      </CCol>
      <CCol sm={12} md={5} lg={3} className="mt-2">
        <div className="d-flex flex-column flex-grow-1">
          <label className="fw-bolder ps-1">End Date</label>
          <CFormInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="ps-2 pt-2"
          />
        </div>
      </CCol>
      <CCol sm={12} md={2} lg={1} className="text-center mt-2">
        <div style={{ minHeight: '24px' }}></div>
        <CButton color="primary" className="w-100" onClick={handleSearch}>
          Search
        </CButton>
      </CCol>
    </CRow>
  );
};


export default BookingSearchBar