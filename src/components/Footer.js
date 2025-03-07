import React from 'react'
import { CCol , CContainer , CRow , CLink , CImage } from '@coreui/react'
import longLogo from '../assets/logo/long-logo.png'

const Footer = () => {
  return (
    <div className="bg-light-subtle py-5">
      <CContainer>
        <CRow className="mb-3">
          <CCol md={3} className="text-dark d-flex flex-column gap-1">
            <h6><strong>Support</strong></h6>
            <CLink href="#" className="text-dark text-decoration-none">Help Center</CLink>
            <CLink href="#" className="text-dark text-decoration-none">AirCover</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Cancellation options</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Report neighborhood concern</CLink>
          </CCol>

          <CCol md={3} className="text-dark d-flex flex-column gap-1">
            <h6><strong>About Us</strong></h6>
            <CLink href="#" className="text-dark text-decoration-none">Our Story</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Contact Us</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Community forum</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Media</CLink>
          </CCol>

          <CCol md={3} className="text-dark d-flex flex-column gap-1">
            <h6><strong>News</strong></h6>
            <CLink href="#" className="text-dark text-decoration-none">Roadmap</CLink>
            <CLink href="#" className="text-dark text-decoration-none">New features</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Careers</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Investors</CLink>
          </CCol>

          <CCol md={3} className="text-dark d-flex flex-column gap-1">
            <h6><strong>Social Media</strong></h6>
            <CLink href="#" className="text-dark text-decoration-none">Linkedin</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Twitter</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Instagram</CLink>
            <CLink href="#" className="text-dark text-decoration-none">Facebook</CLink>
          </CCol>
        </CRow>

        <CRow className="my-4">
          <CCol className="text-dark">
            <h6><strong>Disclaimer</strong></h6>
            <p>
              The Airbnb Newsroom is aimed at journalists. All Homes and Experiences referenced on the Airbnb Newsroom
              are intended purely to inspire and illustrate. We does not recommend or endorse specific Home and
              Experience listings on the Airbnb platform.
            </p>
          </CCol>
        </CRow>

        <CRow>
          <CCol className="text-dark d-flex justify-content-between align-items-center">
            <CImage
              src={longLogo}
              alt="Logo"
              style={{ maxHeight: '40px' }}
            />
            <span>© 2025 Airbnb, Inc. All rights reserved </span>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Footer