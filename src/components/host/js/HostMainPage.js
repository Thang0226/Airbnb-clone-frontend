// Template: https://www.airbnb.com/hosting
import {
    CButton ,
    CContainer ,
    CRow ,
    CCol ,
} from '@coreui/react';
import { useNavigate } from "react-router-dom";
import styles from "../css/CreateHouse.module.css";
import { useEffect } from 'react'
import HostHouseList from './HostHouseList'

export default function HostMainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Airbnb | Host Main Page'
    }, [])
    return (
        <div>
            <CContainer className="py-lg-5 py-3">
                <CRow className={"justify-content-between align-items-center mb-5"}>
                    <CCol>
                        <h2>Welcome, Huy!</h2>
                    </CCol>
                    <CCol className="text-end">
                        <CButton color="dark" variant="outline" className={styles["btn-add-house"]} onClick={() => navigate("/host/create")}>
                            List a House
                        </CButton>
                    </CCol>
                </CRow>
                <CRow className={"justify-content-between align-items-center mb-4"}>
                    <h4>All House Listings</h4>
                </CRow>
                <HostHouseList />
            </CContainer>
        </div>
    )
}