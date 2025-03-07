import {CCol, CRow} from "@coreui/react";

const NumberInfoRow = ({ label = "", value = "" }) => (
    <CRow className="mb-3">
        <CCol md={4} className="fw-bold">{label}</CCol>
        <CCol md={8} className="text-end">{value || "N/A"}</CCol>
    </CRow>
);

export default NumberInfoRow;