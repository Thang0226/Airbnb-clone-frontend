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
} from "@coreui/react";
import {TbBrandAirbnb} from "react-icons/tb";
import {useState} from "react";

export default function Register() {

    const [visible, setVisible] = useState(false);

    return (
        <>
            <CNavbar expand="lg" className="bg-body-tertiary">
                <CContainer fluid>
                    <CNavbarBrand href="#"><TbBrandAirbnb color={"#FF385C"} size={50}/></CNavbarBrand>
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
                            <CButton type="submit" color="success" variant="outline" className="me-5">
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

        </>
    );
}