import NavbarOwner from "./NavbarOwner";
import {
    CButton ,
    CCol ,
    CContainer ,
    CForm ,
    CFormCheck ,
    CFormFloating ,
    CFormInput ,
    CFormSelect
} from '@coreui/react'
import { useNavigate } from "react-router-dom";
import styles from '../css/CreateHouse.module.css'

export default function CreateHouse() {
    return (
        <div>
            <NavbarOwner />
            <CContainer className="py-lg-5 py-3 w-50">
                <CForm className="row g-3 ">
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput type="email" id="inputEmail4" placeholder="Email" />
                            <label htmlFor="inputEmail4">Email</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput type="password" id="inputPassword4" placeholder="Password" />
                            <label htmlFor="inputPassword4">Password</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput id="inputAddress" placeholder="1234 Main St" />
                            <label htmlFor="inputAddress">Address</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
                            <label htmlFor="inputAddress2">Address 2</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput id="inputCity" placeholder="City" />
                            <label htmlFor="inputCity">City</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormSelect id="inputState">
                                <option>Choose...</option>
                                <option>...</option>
                            </CFormSelect>
                            <label htmlFor="inputState">State</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput id="inputZip" placeholder="Zip" />
                            <label htmlFor="inputZip">Zip</label>
                        </CFormFloating>
                    </CCol>
                    <CCol xs={12}>
                        <CFormCheck type="checkbox" id="gridCheck" label="Check me out" />
                    </CCol>
                    <CCol xs={12} className="mt-5">
                        <CButton color="dark rounded-pill" variant="outline" type="submit" className={styles["btn-add-house"]}>
                            Submit
                        </CButton>
                    </CCol>
                </CForm>
            </CContainer>
        </div>
    )
}