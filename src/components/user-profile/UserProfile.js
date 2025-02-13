import React, {useEffect} from 'react';
import {fetchUserProfile} from "../../redux/actions/UserAction";
import {CButton, CCard, CCardBody, CCardHeader, CCol, CRow} from "@coreui/react";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

const UserProfile = ({username}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const location = useLocation();
    // const { username } = location.state || {};

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

    const goToProfileEdit = () => {
        navigate('/profile/edit', { state: { username: userProfile.username } });
    }

    return (
        <div className="container mt-4">
            <CRow className="justify-content-center mt-4">
                <CCol md={6}>
                    <CCard className="shadow border-0">
                        <CCardHeader className="text-center p-4">
                            <img
                                src={"/images/" + userProfile.avatar}
                                alt={userProfile.username}
                                className="rounded-circle border border-blue border-4"
                                width="150"
                                height="150"
                                style={{objectFit: "cover"}}
                            />
                            <h3 className="mt-3">{userProfile.username}</h3>
                        </CCardHeader>
                        <CCardBody className="p-4 row">
                            <CRow className="mb-3">
                                <CCol md={4} className="fw-bold">Full Name</CCol>
                                <CCol md={8}>{userProfile.fullName}</CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CCol md={4} className="fw-bold">Address</CCol>
                                <CCol md={8}>{userProfile.address}</CCol>
                            </CRow>
                            <CRow>
                                <CCol md={4} className="fw-bold">Phone</CCol>
                                <CCol md={8}>{userProfile.phone}</CCol>
                            </CRow>
                            <div className="text-center mt-3">
                                <CButton color="primary" onClick={goToProfileEdit}>
                                    Edit Profile
                                </CButton>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )

}

export default UserProfile;