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
import {useDispatch, useSelector} from "react-redux";
import {setUsername} from "../../redux/slices/usernameSlice";
import Layout from "../Layout";
import {BASE_URL_USER} from "../../constants/api";

export default function Login() {
    const navigate = useNavigate();
    const username = useSelector(state => state.username.username);
    const dispatch = useDispatch();
    const REGEX = {
        username: /^[a-zA-Z0-9_]{4,30}$/,
        password: /^[a-zA-Z0-9!@#$^&)(+=._-]{6,32}$/,
    };

    const initialValues = {
        username: '',
        password: '',
    };
    const formikRef = useRef(null);

    const handleUsernameChange = (e, formikHandleChange) => {
        formikHandleChange(e);
        dispatch(setUsername(e.target.value));
    }

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, "At least 4 characters long")
            .max(30, "At most 30 characters long")
            .matches(REGEX.username, "Username must not contain special characters"),
        password: Yup.string()
            .min(6, "At least 6 characters long")
            .max(32, "At most 32 characters long")
            .matches(REGEX.password, "Invalid password"),
    });

    const handleSubmit = async () => {
        const formValues = formikRef.current.values;
        try {
            await axios.post(`${BASE_URL_USER}`, {
                username: formValues.username,
                password: formValues.password,
            });
        } catch (error) {
            console.log(error);
        }
        alert("Register successfully!");
        navigate("/");
    }

    return (
        <Layout>
            <h2 className={styles.title}>Login</h2>
            <Formik initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    innerRef={formikRef}>
                {({errors, touched, handleChange, handleSubmit}) => (
                    <CForm className={styles.formBox} onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="username" className="col-sm-3 col-form-label">
                                Username:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="text" placeholder="user_name123" id="username" name="username"
                                            value={username} onChange={(e) => handleUsernameChange(e, handleChange)}
                                            required/>
                                {touched.username && errors.username &&
                                    <p className={styles.error}>{errors.username}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="password" className="col-sm-3 col-form-label">
                                Password:
                            </CFormLabel>
                            <CCol sm={8}>
                                <CFormInput type="password" id="password" name="password" onChange={handleChange}
                                            required/>
                                {touched.password && errors.password &&
                                    <p className={styles.error}>{errors.password}</p>}
                            </CCol>
                        </CRow>
                        <CRow className="justify-content-center">
                            <CButton color="primary" type="submit" className="w-25">
                                Login
                            </CButton>
                        </CRow>
                    </CForm>)
                }
            </Formik>
        </Layout>
    );
}