import {CCol, CRow} from "@coreui/react";

const TextInfoRow = ({ label = "", value = "" }) => (
    <CRow className="mb-3">
        <CCol md={4} className="fw-bold">{label}</CCol>
        <CCol md={8}>{value || "N/A"}</CCol>
    </CRow>
);

export default TextInfoRow;