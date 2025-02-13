import React, {useEffect, useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    CFormLabel,
    CFormInput,
    CButton,
    CCol,
    CRow,
    CFormFeedback,
    CCard,
    CCardHeader,
    CCardBody, CFormFloating
} from "@coreui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserProfile, updateUserProfile} from "../../redux/actions/UserAction";

const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    phone: Yup.string()
        .matches(/^0[0-9]{9}$/, "Must be only digits and start with 0")
        .min(10, "Must be at least 10 digits")
        .required("Phone number is required")
});

const getInitialValues = (userProfile) => ({
    username: userProfile.username || "",
    fullName: userProfile.fullName || "",
    address: userProfile.address || "",
    phone: userProfile.phone || "",
    avatar: userProfile.avatar || "default.jpg"
});

const ProfileUpdateForm = () => {
    const [avatarPreview, setAvatarPreview] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { username } = location.state || {};

    useEffect(() => {
        dispatch(fetchUserProfile(username));
    }, [dispatch, username]);

    const {userProfile, error, loading} = useSelector((state) => state.user);

    if (loading || !userProfile) return (
        <div className="container mt-4">
            <CRow className="justify-content-center mt-4">
                <CCol md={6}>
                    <h1 className="text-center">Loading profile...</h1>
                </CCol>
            </CRow>
        </div>
    );
    if (error) return (
        <div className="container mt-4">
            <CRow className="justify-content-center mt-4">
                <CCol md={6}>
                    <h1 className="text-danger">Lỗi: {error}</h1>
                </CCol>
            </CRow>
        </div>
    );

    const handleSubmit = (values, { setSubmitting }) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === "avatar" && values[key]) {
                formData.append(key, values[key]);
            } else {
                formData.append(key, values[key]);
            }
        });
        console.log("Updated Data:", Object.fromEntries(formData.entries()));
        dispatch(updateUserProfile(formData));
        setSubmitting(false);
        navigate("/profile");
    };

    const handleAvatarChange = (e, setFieldValue) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFieldValue("avatar", file);
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mt-4">
            <CRow className="justify-content-center mt-4">
                <CCol md={6}>
                    <CCard className="shadow border-0">
                        <CCardHeader className="text-center p-4">
                            <h3>Update Profile</h3>
                        </CCardHeader>
                        <CCardBody className="p-4">
                            <Formik
                                initialValues={getInitialValues(userProfile)}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting, setFieldValue }) => (
                                    <Form>
                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormFloating>
                                                    <Field
                                                        name="username"
                                                        as={CFormInput}
                                                        type="text"
                                                        id="username"
                                                        className="form-control"
                                                        readOnly
                                                        style={{ cursor: "not-allowed" }}
                                                    />
                                                    <CFormLabel htmlFor="username">Username</CFormLabel>
                                                </CFormFloating>
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3 justify-content-center align-items-center">
                                            <CCol md={2}>
                                                {avatarPreview ? (
                                                    <img
                                                        src={avatarPreview}
                                                        alt="Avatar Preview"
                                                        className="rounded-circle border border-white border-3"
                                                        width="100"
                                                        height="100"
                                                        style={{objectFit: "cover"}}
                                                    />
                                                ) : (
                                                    <img
                                                        src={`/images/${userProfile.avatar}`}
                                                        alt="Current Avatar"
                                                        className="rounded-circle border border-white border-3"
                                                        width="100"
                                                        height="100"
                                                        style={{objectFit: "cover"}}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/default.jpg"; }}
                                                    />
                                                )}
                                            </CCol>
                                            <CCol md={10} className="ps-3">
                                                <CFormInput
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleAvatarChange(e, setFieldValue)}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormFloating>
                                                    <Field
                                                        name="fullName"
                                                        as={CFormInput}
                                                        type="text"
                                                        id="fullName"
                                                        className="form-control"
                                                    />
                                                    <CFormLabel htmlFor="fullName">Full Name <span style={{ color: 'red' }}>*</span></CFormLabel>
                                                </CFormFloating>
                                                <ErrorMessage
                                                    name="fullName"
                                                    component={CFormFeedback}
                                                    className="d-block text-danger mt-1"
                                                />
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormFloating>
                                                    <Field
                                                        name="address"
                                                        as={CFormInput}
                                                        type="text"
                                                        id="address"
                                                        className="form-control"
                                                    />
                                                    <CFormLabel htmlFor="address">Address</CFormLabel>
                                                </CFormFloating>
                                            </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                            <CCol md={12}>
                                                <CFormFloating>
                                                    <Field
                                                        name="phone"
                                                        as={CFormInput}
                                                        type="text"
                                                        id="phone"
                                                        className="form-control"
                                                    />
                                                    <CFormLabel htmlFor="phone">Phone Number <span style={{ color: 'red' }}>*</span></CFormLabel>
                                                </CFormFloating>
                                                <ErrorMessage
                                                    name="phone"
                                                    component={CFormFeedback}
                                                    className="d-block text-danger mt-1"
                                                />
                                            </CCol>
                                        </CRow>

                                        <div className="text-center">
                                            <CButton type="submit" color="primary" disabled={isSubmitting}>
                                                Update Profile
                                            </CButton>
                                            <CButton
                                                type="button"
                                                color="secondary"
                                                className="ms-2"
                                                onClick={() => navigate(`/profile`)}
                                            >
                                                Cancel
                                            </CButton>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );

};

export default ProfileUpdateForm;