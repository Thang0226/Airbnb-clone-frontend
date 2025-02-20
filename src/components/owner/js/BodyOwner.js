// Template: https://www.airbnb.com/hosting
import {
    CButton ,
    CContainer ,
    CRow ,
    CCol , CCard , CCardBody
} from '@coreui/react';
import { useNavigate } from "react-router-dom";
import styles from "../styles.module.css";



export default function BodyOwner() {
    const navigate = useNavigate();
    return (
        <div>
            <CContainer className="py-lg-5 py-3">
                <CRow className={"justify-content-between align-items-center mb-5"}>
                    <CCol>
                        <h2>Welcome, Huy!</h2>
                    </CCol>
                    <CCol className="text-end">
                        <CButton color="dark" variant="outline" className={styles["btn-add-house"]} onClick={() => navigate("/create")}>
                            List a House
                        </CButton>
                    </CCol>
                </CRow>
                <CRow className={"justify-content-between align-items-center mb-4"}>
                    <h4>Your Reservations</h4>

                </CRow>
                <CCard className="mt-4" style={{ background: "#f8f9fa", borderRadius: "12px" }}>
                    <CCardBody className="text-center p-4">
                        <p className="mt-3">You don’t have any guests checking out today or tomorrow.</p>
                    </CCardBody>
                </CCard>
            </CContainer>
        </div>
    )
}