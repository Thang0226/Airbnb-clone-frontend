import React, { useState } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchBarForHouseAvailable = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <CContainer fluid className="bg-light py-3 px-4 rounded-4 shadow-sm">
      <CRow className="g-2 align-items-center">
        {/* Location Input */}
        <CCol xs={12} md>
          <div className="position-relative">
            <CInputGroup className="border-0">
              <CInputGroupText className="bg-transparent border-0">
                <MapPin className="text-primary" size={20} />
              </CInputGroupText>
              <div className="d-flex flex-column flex-grow-1">
                <label className="small text-muted mb-0 ms-2">Địa điểm</label>
                <CFormInput
                  type="text"
                  placeholder="Tìm kiếm điểm đến"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 ps-2 pt-0"
                />
              </div>
            </CInputGroup>
          </div>
        </CCol>

        {/* Check-in Date */}
        <CCol xs={12} md>
          <div className="position-relative border-start">
            <CInputGroup className="border-0">
              <CInputGroupText className="bg-transparent border-0">
                <Calendar className="text-primary" size={20} />
              </CInputGroupText>
              <div className="d-flex flex-column flex-grow-1">
                <label className="small text-muted mb-0 ms-2">Nhận phòng</label>
                <CFormInput
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border-0 ps-2 pt-0"
                />
              </div>
            </CInputGroup>
          </div>
        </CCol>

        {/* Check-out Date */}
        <CCol xs={12} md>
          <div className="position-relative border-start">
            <CInputGroup className="border-0">
              <CInputGroupText className="bg-transparent border-0">
                <Calendar className="text-primary" size={20} />
              </CInputGroupText>
              <div className="d-flex flex-column flex-grow-1">
                <label className="small text-muted mb-0 ms-2">Trả phòng</label>
                <CFormInput
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border-0 ps-2 pt-0"
                />
              </div>
            </CInputGroup>
          </div>
        </CCol>

        {/* Guests Dropdown */}
        <CCol xs={12} md>
          <div className="position-relative border-start">
            <CDropdown>
              <CDropdownToggle className="w-100 bg-transparent border-0 text-start ps-3">
                <Users className="text-primary me-2" size={20} />
                <span className="small text-muted d-block">Khách</span>
                <span>{guests} khách</span>
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => setGuests(1)}>1 khách</CDropdownItem>
                <CDropdownItem onClick={() => setGuests(2)}>2 khách</CDropdownItem>
                <CDropdownItem onClick={() => setGuests(3)}>3 khách</CDropdownItem>
                <CDropdownItem onClick={() => setGuests(4)}>4 khách</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
        </CCol>

        {/* Search Button */}
        <CCol xs={12} md="auto">
          <CButton
            color="danger"
            className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
          >
            <Search size={20} />
            Tìm kiếm
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default SearchBarForHouseAvailable;