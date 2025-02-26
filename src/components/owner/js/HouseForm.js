// import { useState , useEffect , useRef } from 'react'
// import { Formik , Form , Field , ErrorMessage } from 'formik'
// import * as Yup from 'yup'
// import {
//   CContainer ,
//   CForm ,
//   CCol ,
//   CFormFloating ,
//   CFormInput ,
//   CFormTextarea ,
//   CFormLabel ,
//   CRow ,
//   CImage ,
//   CCloseButton ,
//   CButton , CFormFeedback ,
// } from '@coreui/react'
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'
// import MapSample from './MapSample'
//
// export const HouseForm = ({ initialValues , onSubmit , mode = 'create' }) => {
//   const [previews , setPreviews] = useState ( [] )
//   const textareaRef = useRef ( null )
//   const navigate = useNavigate ()
//   const [mapData , setMapData] = useState ( {
//     name: initialValues.address || '' ,
//     address: initialValues.address || '',
//   } )
//   const [selectedAddressData , setSelectedAddressData] = useState ( null )
//
//   const validationSchema = Yup.object ( {
//     houseName: Yup.string ().required ( 'Please enter a house name' ) ,
//     address: Yup.string ().required ( 'Please enter an address' ) ,
//     bedrooms: Yup.number ().min ( 1 , 'Must be at least 1' ).max ( 10 , 'Must not exceed 10' ).required ( 'Required' ) ,
//     bathrooms: Yup.number ().min ( 1 , 'Must be at least 1' ).max ( 3 , 'Must not exceed 3' ).required ( 'Required' ) ,
//     price: Yup.number ().min ( 100000 , 'Price must be at least 100,000 VND' ).required ( 'Required' ) ,
//     description: Yup.string () ,
//   } )
//
//   // Handle file changes
//   const handleFileChange = (event , setFieldValue) => {
//     const files = Array.from ( event.target.files ).filter ( file =>
//       file.type === 'image/jpeg' || file.type === 'image/png' ,
//     )
//     setFieldValue ( 'houseImages' , files )
//
//     const newPreviews = files.map ( file => ({
//       file ,
//       url: URL.createObjectURL ( file ) ,
//     }) )
//     setPreviews ( [...(initialValues.houseImages?.map ( img => ({
//       file: null ,
//       url: `/images/${img.fileName}` ,
//     }) ) || []) , ...newPreviews] )
//   }
//
//   // Remove image
//   const removeImage = (index , setFieldValue) => {
//     const newPreviews = [...previews]
//     URL.revokeObjectURL ( newPreviews[index].url )
//     newPreviews.splice ( index , 1 )
//
//     const isNewImage = index >= (initialValues.houseImages?.length || 0)
//     if (isNewImage) {
//       const updatedFiles = newPreviews.slice ( initialValues.houseImages?.length || 0 ).map ( p => p.file )
//       setFieldValue ( 'houseImages' , updatedFiles )
//     }
//
//     setPreviews ( newPreviews )
//   }
//
//   // Make CFormTextarea expandable
//   useEffect ( () => {
//     const textarea = textareaRef.current
//     if (textarea) {
//       const adjustHeight = () => {
//         textarea.style.height = 'auto'
//         textarea.style.height = `${textarea.scrollHeight}px`
//       }
//       adjustHeight ()
//       textarea.addEventListener ( 'input' , adjustHeight )
//       return () => textarea.removeEventListener ( 'input' , adjustHeight )
//     }
//   } , [] )
//
//   // Handle address selection
//   const handleAddressSelect = (addressData , setFieldValue) => {
//     const formattedAddress = addressData.formattedAddress || ''
//     setMapData ( { name: formattedAddress , address: formattedAddress } )
//     setSelectedAddressData ( addressData )
//     setFieldValue ( 'address' , formattedAddress )
//   }
//
//   return (
//     <CContainer className="py-lg-5 py-3 w-50">
//       <h1 className="my-4">🏡 {mode === 'create' ? 'List a new house' : 'Update House'}</h1>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={async (values , { setSubmitting }) => {
//           try {
//             await onSubmit ( values )
//             toast.success ( `${mode === 'create' ? 'House created' : 'House updated'} successfully` )
//           } catch (error) {
//             console.error ( `Error ${mode}ing house:` , error )
//             toast.error ( `Failed to ${mode} house. Please try again.` )
//           }
//           setSubmitting ( false )
//         }}
//       >
//         {({ values , errors , touched , handleChange , handleBlur , setFieldValue , isSubmitting }) => (
//           <Form className="row g-3 needs-validation" noValidate>
//             {/* House Name */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <Field
//                   as={CFormInput}
//                   type="text"
//                   id="houseName"
//                   name="houseName"
//                   placeholder="Enter House Name"
//                   invalid={touched.houseName && !!errors.houseName}
//                   feedbackInvalid={
//                     <CFormFeedback className="text-warning">
//                       {errors.houseName}
//                     </CFormFeedback>
//                   }
//                   required
//                 />
//                 <CFormLabel htmlFor="houseName">Enter House Name</CFormLabel>
//               </CFormFloating>
//             </CCol>
//
//             {/* Address */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <MapSample
//                   value={mapData.name}
//                   onChange={(newValue) => setMapData ( prev => ({ ...prev , name: newValue }) )}
//                   onAddressSelect={(addressData) => {
//                     setFieldValue ( 'address' , addressData.formattedAddress )
//                     setSelectedAddressData ( addressData )
//                   }}
//                 />
//               </CFormFloating>
//               <ErrorMessage name="address" component="div" className="text-danger" />
//             </CCol>
//
//             {/* Bedrooms */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <Field
//                   as={CFormInput}
//                   type="number"
//                   placeholder="Number of Bedrooms"
//                   id="bedrooms"
//                   name="bedrooms"
//                   min={1}
//                   max={10}
//                   invalid={touched.bedrooms && !!errors.bedrooms}
//                   feedbackInvalid={<CFormFeedback className="text-warning">{errors.bedrooms}</CFormFeedback>}
//                   required
//                 />
//                 <CFormLabel htmlFor="bedrooms">Number of Bedrooms</CFormLabel>
//               </CFormFloating>
//             </CCol>
//
//             {/* Bathrooms */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <Field
//                   as={CFormInput}
//                   type="number"
//                   placeholder="Number of Bathrooms"
//                   id="bathrooms"
//                   name="bathrooms"
//                   min={1}
//                   max={3}
//                   invalid={touched.bathrooms && !!errors.bathrooms}
//                   feedbackInvalid={<CFormFeedback className="text-warning">{errors.bathrooms}</CFormFeedback>}
//                   required
//                 />
//                 <CFormLabel htmlFor="bathrooms">Number of Bathrooms</CFormLabel>
//               </CFormFloating>
//             </CCol>
//
//             {/* Description */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <Field
//                   as={CFormTextarea}
//                   placeholder="Description"
//                   id="description"
//                   name="description"
//                   rows={3}
//                   ref={textareaRef}
//                   style={{ overflow: 'hidden' , resize: 'none' }}
//                   // invalid={touched.description && !!errors.description}
//                   feedbackValid={
//                     <CFormFeedback className="text-info">
//                       Introduce your house, amenities, and other information
//                     </CFormFeedback>}
//                 />
//                 <CFormLabel htmlFor="description">Description</CFormLabel>
//                 <ErrorMessage name="description" component="div" className="text-danger" />
//               </CFormFloating>
//             </CCol>
//
//             {/* Price */}
//             <CCol xs={12}>
//               <CFormFloating>
//                 <Field
//                   as={CFormInput}
//                   type="number"
//                   placeholder="Enter price (VND)"
//                   id="price"
//                   name="price"
//                   min={100000}
//                   invalid={touched.price && !!errors.price}
//                   feedbackInvalid={
//                     <CFormFeedback className="text-warning">
//                       {errors.price}
//                     </CFormFeedback>
//                   }
//                   required
//                 />
//                 <CFormLabel htmlFor="price">Enter price per day (VND)</CFormLabel>
//               </CFormFloating>
//             </CCol>
//
//             {/* Image */}
//             <CCol xs={12}>
//               <CFormLabel htmlFor="houseImages" className="my-3">Upload House Images (PNG, JPEG)</CFormLabel>
//               <Field
//                 as={CFormInput}
//                 type="file"
//                 id="houseImages"
//                 name="houseImages"
//                 accept="image/jpeg, image/png"
//                 onChange={(e) => handleFileChange ( e , setFieldValue )}
//                 feedbackValid={
//                   <CFormFeedback className="text-info">
//                     If no image is uploaded, a default image will be used.
//                   </CFormFeedback>
//                 }
//                 multiple
//               />
//               {/* Preview */}
//               <CRow className="mt-4 g-4">
//                 {previews.map ( (preview , index) => (
//                   <CCol key={index} xs="auto" className="position-relative">
//                     <CCloseButton
//                       className="position-absolute top-0 end-0 rounded-circle p-1"
//                       color="white"
//                       onClick={() => removeImage ( index , setFieldValue )}
//                     />
//                     <CImage
//                       src={preview.url}
//                       alt={`Preview ${index}`}
//                       className="object-fit-cover rounded"
//                       style={{ width: '6rem' , height: '6rem' }}
//                     />
//                   </CCol>
//                 ) )}
//               </CRow>
//             </CCol>
//
//             {/* Submit Button */}
//             <CCol xs={12} className="mt-5">
//               <CButton
//                 color="dark"
//                 shape="rounded-pill"
//                 type="submit"
//                 disabled={isSubmitting}
//               >
//                 {mode === 'create' ? 'Add a House' : 'Update House'}
//               </CButton>
//               <CButton
//                 color="light"
//                 shape="rounded-pill"
//                 className="ms-3"
//                 onClick={() => navigate ( '/owner' )}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </CButton>
//             </CCol>
//           </Form>
//         )}
//       </Formik>
//     </CContainer>
//   )
// }