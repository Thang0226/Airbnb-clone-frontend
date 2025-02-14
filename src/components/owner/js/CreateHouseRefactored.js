// Template: https://www.airbnb.com/become-a-host

import NavbarOwner from "./NavbarOwner";
import React , { useRef , useState , useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import MapSample from "./MapSample";
import styles from '../css/CreateHouse.module.css';
import {
    CContainer , CForm , CCol , CFormFloating ,
    CFormInput , CButton , CFormTextarea , CFormLabel
} from '@coreui/react';

export default function CreateHouseRefactored() {
    const [validated , setValidated] = useState ( false );
    const navigate = useNavigate ();
    const [addressData , setAddressData] = useState ( {name: '' , details: null} );
    const textareaRef = useRef ( null );

    // Auto-expanding textarea
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

    const handleSubmit = async (event) => {
        event.preventDefault ();
        const form = event.currentTarget;

        if (!form.checkValidity ()) {
            event.stopPropagation ();
            setValidated ( true );
            return;
        }

        try {
            const formData = new FormData ( form );
            const payload = new FormData ();

            // Construct house data
            const houseInfo = {
                houseName: formData.get ( "houseName" ) ,
                address: addressData.details?.formattedAddress || '' ,
                latitude: addressData.details?.latitude || '' ,
                longitude: addressData.details?.longitude || '' ,
                bedrooms: Number ( formData.get ( "bedrooms" ) ) ,
                bathrooms: Number ( formData.get ( "bathrooms" ) ) ,
                description: formData.get ( "description" ) ,
                price: Number ( formData.get ( "price" ) )
            };

            payload.append ( "house" , new Blob ( [JSON.stringify ( houseInfo )] , {type: "application/json"} ) );

            // Handle multiple images
            const images = formData.getAll ( "houseImages" );
            images.forEach ( img => img.size > 0 && payload.append ( "houseImages" , img ) );

            await axios.post ( "http://localhost:8080/api/houses/create" , payload , {
                headers: {'Content-Type': 'multipart/form-data'}
            } );

            // navigate ( "/" );
        } catch (error) {
            console.error ( "Submission error:" , error );
        }
        setValidated ( true );
    };

    const formFields = [
        {id: 'houseName' , label: 'House Name' , type: 'text' , required: true} ,
        {id: 'bedrooms' , label: 'Number of Bedrooms' , type: 'number' , props: {min: 1 , max: 10}} ,
        {id: 'bathrooms' , label: 'Number of Bathrooms' , type: 'number' , props: {min: 1 , max: 3}} ,
        {id: 'price' , label: 'Price per day (VND)' , type: 'number' , props: {min: 100000}} ,
    ];

    return (
        <div>
            <NavbarOwner />
            <CContainer className="py-lg-5 py-3 w-50">
                <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                    {formFields.map ( ({id , label , type , props , required}) => (
                        <CCol xs={12} key={id}>
                            <CFormFloating>
                                <CFormInput
                                    type={type}
                                    id={id}
                                    name={id}
                                    placeholder={label}
                                    required={required}
                                    feedbackInvalid={`Please enter ${label.toLowerCase ()}`}
                                    {...props}
                                />
                                <CFormLabel htmlFor={id}>{label}</CFormLabel>
                            </CFormFloating>
                        </CCol>
                    ) )}

                    <CCol xs={12}>
                        <CFormFloating>
                            <MapSample
                                value={addressData.name}
                                onChange={name => setAddressData ( prev => ({...prev , name}) )}
                                onAddressSelect={data => setAddressData ( {
                                    name: data.formattedAddress ,
                                    details: data
                                } )}
                            />
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormFloating>
                            <CFormTextarea
                                id="description"
                                name="description"
                                placeholder="Description"
                                ref={textareaRef}
                                style={{overflow: 'hidden' , resize: 'none'}}
                            />
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                        </CFormFloating>
                    </CCol>

                    <CCol xs={12}>
                        <CFormLabel htmlFor="houseImages" className="my-3">
                            Upload House Images (PNG, JPEG)
                        </CFormLabel>
                        <CFormInput
                            type="file"
                            id="houseImages"
                            name="houseImages"
                            accept="image/jpeg, image/png"
                            multiple
                        />
                    </CCol>

                    <CCol xs={12} className="mt-5">
                        <CButton color="dark rounded-pill" variant="outline" type="submit"
                                 className={styles["btn-add-house"]}>
                            Add House
                        </CButton>
                    </CCol>
                </CForm>
            </CContainer>
        </div>
    );
}