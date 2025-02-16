import NavbarOwner from "./NavbarOwner";
import MapSample from "./MapSample";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from '../css/CreateHouse.module.css';
import {
    CContainer, CForm, CCol, CFormFloating,
    CFormInput, CButton, CFormTextarea, CFormLabel,
    CCloseButton, CImage, CRow
} from '@coreui/react';
import axios from 'axios';

// Yup validation schema
const validationSchema = Yup.object({
    houseName: Yup.string().required('House name is required'),
    address: Yup.string().required('Address is required'),
    bedrooms: Yup.number()
        .min(1, 'Must be at least 1')
        .max(10, 'Must be at most 10')
        .required('Number of bedrooms is required'),
    bathrooms: Yup.number()
        .min(1, 'Must be at least 1')
        .max(3, 'Must be at most 3')
        .required('Number of bathrooms is required'),
    price: Yup.number()
        .min(100000, 'Must be at least 100,000 VND')
        .required('Price is required'),
    description: Yup.string(),
    houseImages: Yup.array().nullable()
});

export default function CreateHouseYup() {
    const navigate = useNavigate();
    const [previews, setPreviews] = useState([]);
    const textareaRef = useRef(null);

    const formik = useFormik({
        initialValues: {
            houseName: '',
            address: '',
            bedrooms: '',
            bathrooms: '',
            price: '',
            description: '',
            houseImages: []
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('houseName', values.houseName);
            formData.append('address', JSON.stringify(mapData.address));
            formData.append('bedrooms', values.bedrooms);
            formData.append('bathrooms', values.bathrooms);
            formData.append('price', values.price);
            formData.append('description', values.description);
            values.houseImages.forEach((file) => {
                formData.append('houseImages', file);
            });

            try {
                const response = await axios.post('http://localhost:8080/api/houses/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('House created successfully:', response.data);
                navigate('/');
            } catch (error) {
                console.error('Error creating house:', error);
            }
        }
    });

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file =>
            file.type === 'image/jpeg' || file.type === 'image/png'
        );
        formik.setFieldValue('houseImages', validFiles);

        const newPreviews = validFiles.map(file => ({
            file: file,
            url: URL.createObjectURL(file)
        }));

        previews.forEach(preview => URL.revokeObjectURL(preview.url));
        setPreviews(newPreviews);
    };

    const removeImage = (index) => {
        const newPreviews = [...previews];
        const newFiles = [...formik.values.houseImages];

        URL.revokeObjectURL(previews[index].url);

        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);

        setPreviews(newPreviews);
        formik.setFieldValue('houseImages', newFiles);
    };

    // Map stuff
    const [mapData, setMapData] = useState({
        name: '',
        address: ''
    });

    const handleAddressSelect = (addressData) => {
        setMapData({
            name: addressData.formattedAddress,
            address: addressData.addressComponents
        });
        formik.setFieldValue('address', addressData.formattedAddress);
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const adjustHeight = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };
            adjustHeight();
            textarea.addEventListener('input', adjustHeight);
            return () => textarea.removeEventListener('input', adjustHeight);
        }
    }, []);

    return (
        <div>
            <NavbarOwner />
            <CContainer className="py-lg-5 py-3 w-50">
                <h1 className="my-4">🏡 List a new house</h1>
                <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="text"
                                id="houseName"
                                name="houseName"
                                placeholder="Enter House Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.houseName}
                            />
                            <CFormLabel htmlFor="houseName">Enter House Name</CFormLabel>
                            {formik.touched.houseName && formik.errors.houseName ? (
                                <div className="text-danger">{formik.errors.houseName}</div>
                            ) : null}
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <MapSample
                                value={mapData.name}
                                onChange={(newValue) => setMapData(prev => ({ ...prev, name: newValue }))}
                                onAddressSelect={handleAddressSelect}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="text-danger">{formik.errors.address}</div>
                            ) : null}
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                id="bedrooms"
                                name="bedrooms"
                                placeholder="Number of Bedrooms"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bedrooms}
                            />
                            <CFormLabel htmlFor="bedrooms">Number of Bedrooms</CFormLabel>
                            {formik.touched.bedrooms && formik.errors.bedrooms ? (
                                <div className="text-danger">{formik.errors.bedrooms}</div>
                            ) : null}
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                id="bathrooms"
                                name="bathrooms"
                                placeholder="Number of Bathrooms"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.bathrooms}
                            />
                            <CFormLabel htmlFor="bathrooms">Number of Bathrooms</CFormLabel>
                            {formik.touched.bathrooms && formik.errors.bathrooms ? (
                                <div className="text-danger">{formik.errors.bathrooms}</div>
                            ) : null}
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Description"
                                id="description"
                                name="description"
                                rows={3}
                                ref={textareaRef}
                                style={{ overflow: 'hidden', resize: 'none' }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.description}
                            />
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Enter price (VND)"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.price}
                            />
                            <CFormLabel htmlFor="price">Enter price per day (VND)</CFormLabel>
                            {formik.touched.price && formik.errors.price ? (
                                <div className="text-danger">{formik.errors.price}</div>
                            ) : null}
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormLabel htmlFor="houseImages" className="my-3">Upload House Images (PNG, JPEG)</CFormLabel>
                        <CFormInput
                            type="file"
                            id="houseImages"
                            name="houseImages"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            multiple
                        />
                        <CRow className="mt-4 g-4">
                            {previews.map((preview, index) => (
                                <CCol key={index} xs="auto" className="position-relative">
                                    <CCloseButton className="position-absolute top-0 end-0 rounded-circle p-1"
                                                  color="white" onClick={() => removeImage(index)} />
                                    <CImage
                                        src={preview.url}
                                        alt={`Preview ${index}`}
                                        className="object-fit-cover rounded"
                                        style={{ width: '6rem', height: '6rem' }}
                                    />
                                </CCol>
                            ))}
                        </CRow>
                    </CCol>

                    <CCol xs={12} className="mt-5">
                        <CButton
                            color="dark rounded-pill"
                            variant="outline"
                            type="submit"
                            className={styles["btn-add-house"]}
                        >
                            Add House
                        </CButton>
                    </CCol>
                </CForm>
            </CContainer>
        </div>
    );
}
