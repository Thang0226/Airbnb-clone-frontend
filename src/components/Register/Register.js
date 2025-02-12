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
import styles from "./styles.module.css"

export default function Register() {

    const [visible, setVisible] = useState(false);
    const REGEX = {
        email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$/,
        password: /^[a-zA-Z0-9!@#$%^&*)(+=._-]{6,}$/,
        phone: /^0[0-9]{9}$/
    };
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    function handleSubmit() {
        alert("Login in successfully!");
        navigate("/login", {state: {account: form.username}});
    }

    function handleValidate() {
        const errors = {};

        if (form.username) {
            if (!REGEX.username.test(form.username)) {
                errors.username = "Invalid username";
            }
        }

        if (form.phone) {
            if (!REGEX.phone.test(form.phone)) {
                errors.phone = "Invalid phone number";
            }
        }

        if (form.password) {
            if (!REGEX.password.test(form.password)) {
                errors.password = "Invalid password";
            }
            if (form.password !== form.confirm_password) {
                errors.confirm_password = "Confirm password not match";
            }
        }

        return errors;
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
            <CForm className={styles.formBox}>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="username" className="col-sm-4 col-form-label">
                        Username:
                    </CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="username" name="username" onChange={handleChange}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="phone" className="col-sm-4 col-form-label">
                        Phone:
                    </CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="text" id="phone" name="phone" onChange={handleChange}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CFormLabel htmlFor="password" className="col-sm-4 col-form-label">
                        Password:
                    </CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="password" id="password" name="password" onChange={handleChange}/>
                    </CCol>
                </CRow>
                <CRow className="mb-4">
                    <CFormLabel htmlFor="confirm_password" className="col-sm-4 col-form-label">
                        Confirm Password:
                    </CFormLabel>
                    <CCol sm={8}>
                        <CFormInput type="password" id="confirm_password" name="confirm_password"
                                    onChange={handleChange}/>
                    </CCol>
                </CRow>
                <CButton color="primary" type="submit">
                    Register
                </CButton>
            </CForm>
        </>
    );
}