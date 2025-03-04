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
    const hostUsername = localStorage.getItem('username');

    useEffect(() => {
        document.title = 'Airbnb | Host Main Page'
    }, [])
    return (
        <>
            <CContainer className="py-lg-4 py-3">
                <CRow className={"justify-content-between align-items-center mb-5"}>
                    <CCol>
                        <h2>Welcome host {hostUsername}!</h2>
                    </CCol>
                    <CCol className="text-end">
                        <CButton color="primary" variant="outline" className={styles["btn-add-house"]} onClick={() => navigate("/host/create")}>
                            List a House
                        </CButton>
                    </CCol>
                </CRow>
                    <h4>Your houses</h4>
                <HostHouseList />
            </CContainer>
        </>
    )
}