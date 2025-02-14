// Template: https://www.airbnb.com/become-a-host

import NavbarOwner from "./NavbarOwner";
import MapSample from "./MapSample";
import { useNavigate } from "react-router-dom";
import React , { useRef , useState , useEffect } from 'react'
import styles from '../css/CreateHouse.module.css'
import {
    CContainer ,
    CForm ,
    CCol ,
    CFormFloating ,
    CFormInput ,
    CButton , CFormTextarea , CFormLabel ,
    CCloseButton , CImage , CRow
} from '@coreui/react';
import axios from 'axios';

export default function CreateHouse() {
    const [validated , setValidated] = useState ( false );
    const navigate = useNavigate ();

    // Upload files
    const [selectedFiles , setSelectedFiles] = useState ( [] );
    const [previews , setPreviews] = useState ( [] );
    const handleFileChange = (event) => {
        const files = Array.from ( event.target.files );
        const validFiles = files.filter ( file =>
            file.type === 'image/jpeg' || file.type === 'image/png'
        );
        setSelectedFiles ( validFiles );

        // Create preview URLs
        const newPreviews = validFiles.map ( file => ({
            file: file ,
            url: URL.createObjectURL ( file )
        }) );

        // Clean up old preview URLs
        previews.forEach ( preview => URL.revokeObjectURL ( preview.url ) );
        setPreviews ( newPreviews );
    };
    const removeImage = (index) => {
        const newPreviews = [...previews];
        const newFiles = [...selectedFiles];

        // Clean up the preview URL
        URL.revokeObjectURL ( previews[index].url );

        newPreviews.splice ( index , 1 );
        newFiles.splice ( index , 1 );

        setPreviews ( newPreviews );
        setSelectedFiles ( newFiles );
    };

    // Suggest addresses from MapAPI
    const [mapData , setMapData] = useState ( {
        name: '' ,
        address: ''
    } );
    const [selectedAddressData , setSelectedAddressData] = useState ( null );
    const handleAddressSelect = (addressData) => {
        setMapData ( {
            name: addressData.formattedAddress ,
            address: addressData.addressComponents
        } );
        setSelectedAddressData ( addressData );
    } // end Map stuff

    // Make CFormTextarea expandable:
    const textareaRef = useRef ( null );
    useEffect ( () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const adjustHeight = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };
            adjustHeight ();
            textarea.addEventListener ( 'input' , adjustHeight );
            return () => textarea.removeEventListener ( 'input' , adjustHeight );
        }
    } , [] );

    // Submit
    const handleSubmit = async (event) => {
        event.preventDefault ();

        const form = event.currentTarget
        if (form.checkValidity () === false) {
            event.stopPropagation ();
            setValidated ( true );
            return;
        }

        // Collect form data
        const formData = new FormData ( form );
        formData.append ( 'address' , JSON.stringify ( mapData.address ) );
        selectedFiles.forEach ( file => {
            formData.append ( 'houseImages' , file );
        } );

        // Send request
        axios.post ( 'http://localhost:8080/api/houses/create' , formData , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        } )
            .then ( response => {
                console.log ( 'House created successfully:' , response.data );
                navigate ( '/' );
            } )
            .catch ( error => {
                console.error ( 'Error creating house:' , error );
            } );
    };


    return (
        <div>
            <NavbarOwner/>
            <CContainer className="py-lg-5 py-3 w-50">
                <h1 className="my-4">🏡 List a new house</h1>
                <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >

                    {/* House Name */}
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="text"
                                id="houseName"
                                name="houseName"
                                placeholder="Enter House Name"
                                feedbackInvalid="Please enter a house name"
                                required
                            />
                            <CFormLabel htmlFor="houseName">Enter House Name</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    {/* Address */}
                    <CCol xs={12}>
                        <CFormFloating>
                            <MapSample
                                value={mapData.name}
                                onChange={(newValue) => setMapData ( prev => ({...prev , name: newValue}) )}
                                onAddressSelect={handleAddressSelect}
                            />
                        </CFormFloating>
                    </CCol>

                    {/*/!* Bedrooms *!/*/}
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                placeholder="Number of Bedrooms"
                                id="bedrooms"
                                name="bedrooms"
                                min={1}
                                max={10}
                                feedbackInvalid="Please enter number of bedrooms (1-10)"
                                required
                            />
                            <CFormLabel htmlFor="bedrooms">Number of Bedrooms</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    {/*/!* Bathrooms *!/*/}
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                placeholder="Number of Bathrooms"
                                id="bathrooms"
                                name="bathrooms"
                                min={1}
                                max={3}
                                feedbackInvalid="Please enter number of bedrooms (1-3)"
                                required
                            />
                            <CFormLabel htmlFor="bathrooms">Number of Bathrooms</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    {/*/!* Description *!/*/}
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormTextarea
                                placeholder="Description"
                                id="description"
                                name="description"
                                rows={3}
                                ref={textareaRef}
                                style={{overflow: 'hidden' , resize: 'none'}}
                                feedbackValid="Introduce your house, amenities, and other information"
                                //required
                            />
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    {/*/!* Price *!/*/}
                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormInput
                                type="number"
                                placeholder="Enter price (VND)"
                                id="price"
                                name="price"
                                min={100000}
                                feedbackInvalid="Please enter price per day in VND (min 100.000)"
                                required
                            />
                            <CFormLabel htmlFor="price">Enter price per day (VND)</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    {/*/!* Image *!/*/}
                    <CCol xs={12}>
                        <CFormLabel htmlFor="houseImages" className="my-3">Upload House Images (PNG, JPEG)</CFormLabel>
                        <CFormInput
                            type="file"
                            id="houseImages"
                            name="houseImages"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            // feedbackValid="If no image is uploaded, a default image will be used."
                            multiple
                            // required
                        />
                        {/* Preview */}
                        <CRow className="mt-4 g-4">
                            {previews.map ( (preview , index) => (
                                <CCol key={index} xs="auto" className="position-relative">
                                    <CCloseButton className="position-absolute top-0 end-0 rounded-circle p-1"
                                                  color="white" onClick={() => removeImage ( index )}/>
                                    <CImage
                                        src={preview.url}
                                        alt={`Preview ${index}`}
                                        className="object-fit-cover rounded"
                                        style={{width: '6rem' , height: '6rem'}}
                                    />
                                </CCol>
                            ) )}
                        </CRow>
                    </CCol>

                    {/*/!* Submit Button *!/*/}
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
    )
}