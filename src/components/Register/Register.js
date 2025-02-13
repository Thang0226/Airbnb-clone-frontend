import {
    CButton,
    CForm,
    CFormInput,
    CCol,
    CRow,
    CFormLabel,
} from "@coreui/react";
import {useNavigate} from "react-router-dom";
import styles from "./styles.module.css";
import {useRef} from "react";
import {Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import MenuBar from "../MenuBar";
import {BASE_URL_USER} from "../../constants/api";

export default function Register() {
    const navigate = useNavigate();
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
            .matches(REGEX.username, "Not contain special characters")
            .test("Duplicate username", "Username already exists", async function (value) {
                try {
                    await axios.post(`${BASE_URL_USER}/validate-username`, {
                        username: value,
                    });
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }),
        phone: Yup.string()
            .matches(REGEX.phone, "Invalid phone number")
            .test("Duplicate phone number", "Phone number already exists", async function (value) {
                try {
                    await axios.post(`${BASE_URL_USER}/validate-phone`, {
                        username: value,
                    });
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }),
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
            <MenuBar/>
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
                                {touched.username && errors.username &&
                                    <p className={styles.error}>{errors.username}</p>}
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
                                {touched.phone && errors.phone && <p className={styles.error}>{errors.phone}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className="col-sm-4 col-form-label">
                                Password:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="password" id="password" name="password" onChange={handleChange}
                                            required/>
                                {touched.password && errors.password &&
                                    <p className={styles.error}>{errors.password}</p>}
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
                                    <p className={styles.error}>{errors.confirm_password}</p>}
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