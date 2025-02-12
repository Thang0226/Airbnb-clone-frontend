import {
    CButton,
    CCollapse,
    CContainer,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CForm,
    CFormInput,
    CNavbar,
    CNavbarBrand,
    CNavbarNav,
    CNavbarToggler,
    CNavItem,
    CNavLink,
    CCol,
    CRow,
    CFormCheck,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
} from "@coreui/react";
import {TbBrandAirbnb} from "react-icons/tb";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./styles.module.css";
import {useRef} from "react";
import {Formik} from "formik";
import * as Yup from "yup";

export default function Register() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const REGEX = {
        username: /^[a-zA-Z0-9_]{4,30}$/,
        password: /^[a-zA-Z0-9!@#$%^&*)(+=._-]{6,32}$/,
        phone: /^0[0-9]{9}$/
    };

    const initialValues = {
        username: '',
        phone: '',
        password: '',
        confirm_password: ''
    };
    const formikRef = useRef(null);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, "At least 4 characters long")
            .max(30, "At most 30 characters long")
            .matches(REGEX.username, "Not contain special characters"),
        phone: Yup.string().matches(REGEX.phone, "Invalid phone number"),
        password: Yup.string()
            .min(6, "At least 6 characters long")
            .max(32, "At most 32 characters long")
            .matches(REGEX.password, "Invalid password"),
        confirm_password: Yup.string()
            .test(
                "Same passwords",
                "Passwords must match",
                function (value) {
                    return this.parent.password === value;
                }
            ),
    });

    const handleSubmit = () => {
        console.log(formikRef.current.values);
        alert("Register successfully!");
        navigate("/login");
    }

    return (
        <>
            <CNavbar expand="lg" className="bg-body-tertiary">
                <CContainer fluid>
                    <CNavbarBrand href="#"><TbBrandAirbnb color={"#FF385C"} size={40}/></CNavbarBrand>
                    <CNavbarToggler onClick={() => setVisible(!visible)}/>
                    <CCollapse className="navbar-collapse" visible={visible}>
                        <CNavbarNav className="me-auto">
                            <CNavItem>
                                <CNavLink href="#" active>
                                    Home
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#">Airbnb Your Home</CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="#" disabled>
                                    Disabled
                                </CNavLink>
                            </CNavItem>
                        </CNavbarNav>
                        <CForm className="d-inline-flex">
                            <CFormInput type="search" className="me-2" placeholder="Search"/>
                            <CButton type="submit" color="primary" variant="outline" className="me-5">
                                Search
                            </CButton>
                        </CForm>
                        <CDropdown variant="dropdown" popper={true}>
                            <CDropdownToggle color="secondary">User</CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="/#/register">Register</CDropdownItem>
                                <CDropdownItem href="#">Login</CDropdownItem>
                                <CDropdownDivider/>
                                <CDropdownItem href="#">Something else here</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </CCollapse>
                </CContainer>
            </CNavbar>
            <h2 className={styles.title}>Register New Account</h2>
            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    innerRef={formikRef}>
                {({errors, touched, handleChange, handleSubmit}) => (
                    <CForm className={styles.formBox} onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className="col-sm-4 col-form-label">
                                Username:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="text" placeholder="user_name123" id="username" name="username"
                                            onChange={handleChange} required/>
                                {touched.username && errors.username && <p className="error">{errors.username}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="phone" className="col-sm-4 col-form-label">
                                Phone:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="text" placeholder="0123456789" id="phone" name="phone"
                                            onChange={handleChange}
                                            required/>
                                {touched.phone && errors.phone && <p className="error">{errors.phone}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className="col-sm-4 col-form-label">
                                Password:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="password" id="password" name="password" onChange={handleChange}
                                            required/>
                                {touched.password && errors.password && <p className="error">{errors.password}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-4">
                            <CFormLabel htmlFor="confirm_password" className="col-sm-4 col-form-label">
                                Confirm Password:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="password" id="confirm_password" name="confirm_password"
                                            onChange={handleChange} required/>
                                {touched.confirm_password && errors.confirm_password &&
                                    <p className="error">{errors.confirm_password}</p>}
                            </CCol>
                        </CRow>
                        <CButton color="primary" type="submit">
                            Register
                        </CButton>
                    </CForm>)
                }
            </Formik>
        </>
    );
}