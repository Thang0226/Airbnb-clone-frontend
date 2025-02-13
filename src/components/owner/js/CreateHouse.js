// Template: https://www.airbnb.com/become-a-host

import NavbarOwner from "./NavbarOwner";
import { useNavigate } from "react-router-dom";
import React , { useRef , useState , useEffect } from 'react'
import styles from '../css/CreateHouse.module.css'
import {
    CContainer ,
    CForm ,
    CCol ,
    CFormFloating ,
    CFormInput ,
    CButton , CFormTextarea , CFormLabel
} from '@coreui/react';

export default function CreateHouse() {
    const [validated , setValidated] = useState ( false );
    const navigate = useNavigate ();
    const textareaRef = useRef ( null );
    // const defaultImage = "../../../assets/cottage.jpg"

    // Expandable Description CFormTextarea
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

    const handleSubmit = (event) => {
        event.preventDefault ()
        const form = event.currentTarget

        if (!form.checkValidity ()) {
            event.stopPropagation ();
            return;  // Stop execution if invalid
        }
        setValidated ( true )

        // Old code: Simply log form data
        // const formData = new FormData(form);
        // const formObject = Object.fromEntries(formData.entries());
        // console.log(formObject);

        // New code by ChatGPT: https://chatgpt.com/share/67adaab7-889c-800b-a9f0-204a7b2ffc2f
        const formData = new FormData ( form );

        //  FormData object:
        const houseData = new FormData ();
        houseData.append ( "house" , new Blob ( [JSON.stringify ( {
            houseName: formData.get ( "houseName" ) ,
            address: formData.get ( "address" ) ,
            bedrooms: Number ( formData.get ( "bedrooms" ) ) ,
            bathrooms: Number ( formData.get ( "bathrooms" ) ) ,
            description: formData.get ( "description" ) ,
            price: Number ( formData.get ( "price" ) )
        } )] , {type: "application/json"} ) ); // append other info using Blob

        const houseImage = formData.get ( "houseImages" );
        if (houseImage && houseImage.size > 0) {
            houseData.append ( "houseImages" , houseImage );
        } // append image

        // Send request
        fetch ( "http://localhost:8080/api/houses/create" , {
            method: "POST" ,
            body: houseData
        } )
            .then ( response => response.json () )
            .then ( savedHouse => {
                console.log ( "House saved:" , savedHouse );
                // navigate("/");
            } )
            .catch ( error => console.error ( "Error:" , error ) );
    };

    return (
        <div>
            <NavbarOwner/>
            <CContainer className="py-lg-5 py-3 w-50">
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
                            <CFormInput
                                type="text"
                                placeholder="Enter House Address"
                                id="address"
                                name="address"
                                feedbackInvalid="Please enter a house address"
                                required
                            />
                            <CFormLabel htmlFor="address">Enter House Address</CFormLabel>
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
                        <CFormLabel htmlFor="houseImages"
                                    className="my-3">Upload House Images (PNG, JPEG)</CFormLabel>
                        <CFormInput
                            type="file"
                            id="houseImages"
                            name="houseImages"
                            accept="image/jpeg, image/png"
                            feedbackValid="If no image is uploaded, a default image will be used."
                            multiple
                            // required
                        />
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