import MapSample from './MapSample'
import { useNavigate } from 'react-router-dom'
import React , { useRef , useState , useEffect } from 'react'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import {
  CContainer ,
  CForm ,
  CCol ,
  CFormFloating ,
  CFormInput ,
  CButton , CFormTextarea , CFormLabel ,
  CImage , CRow ,
} from '@coreui/react'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function CreateHouse() {
  const [validated , setValidated] = useState ( false )
  const navigate = useNavigate ()
  const token = useSelector ( state => state.account.token )
  const username = localStorage.getItem ( 'username' )

  useEffect ( () => {
    document.title = 'Airbnb | Add House'
  } , [] )

  // Upload Images
  const [selectedFiles , setSelectedFiles] = useState ( [] )
  const [previews , setPreviews] = useState ( [] )
  const [error , setError] = useState ( '' )
  const handleFileChange = (event) => {
    const files = Array.from ( event.target.files )
    const validFiles = []
    let totalSize = 0
    let hasError = false

    files.forEach ( file => {
      if (file.size > 5 * 1024 * 1024) {
        hasError = true
      } else if (file.type === 'image/jpeg' || file.type === 'image/png') {
        validFiles.push ( file )
        totalSize += file.size
      }
    } )
    if (totalSize > 100 * 1024 * 1024) {
      hasError = true;
    }

    setError ( hasError ? 'Each image must be <=5MB. Total size must be <=100MB' : '' )
    setSelectedFiles ( validFiles )

    const newPreviews = validFiles.map ( file => ({
      file: file ,
      url: URL.createObjectURL ( file ) ,
    }) ) // generate preview URLs

    previews.forEach ( preview => URL.revokeObjectURL ( preview.url ) ) // clean old preview url
    setPreviews ( newPreviews ) // update preview state with new images
  }
  // Remove Images
  const removeImage = (index) => {
    const newPreviews = [...previews]
    const newFiles = [...selectedFiles]

    URL.revokeObjectURL ( previews[index].url ) // clean old preview url

    newPreviews.splice ( index , 1 )
    newFiles.splice ( index , 1 )

    setPreviews ( newPreviews )
    setSelectedFiles ( newFiles )
  }

  // MapAPI for Address input
  const [mapData , setMapData] = useState ( {
    name: '' ,
    address: '' ,
  } )
  const [selectedAddressData , setSelectedAddressData] = useState ( null )
  const handleAddressSelect = (addressData) => {
    const formattedAddress = addressData.formattedAddress || ''
    setMapData ( {
      name: formattedAddress ,
      address: formattedAddress ,
    } )
    setSelectedAddressData ( addressData )
  }

  // Make CFormTextarea expandable:
  const textareaRef = useRef ( null )
  useEffect ( () => {
    const textarea = textareaRef.current
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
      adjustHeight ()
      textarea.addEventListener ( 'input' , adjustHeight )
      return () => textarea.removeEventListener ( 'input' , adjustHeight )
    }
  } , [] )

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault ()

    const form = event.currentTarget
    if (form.checkValidity () === false) {
      event.stopPropagation ()
      setValidated ( true )
      return
    }

    // Collect form data
    const formData = new FormData ()
    formData.append ( 'houseName' , form.houseName.value )
    formData.append ( 'bedrooms' , form.bedrooms.value )
    formData.append ( 'bathrooms' , form.bathrooms.value )
    formData.append ( 'price' , form.price.value )
    formData.append ( 'description' , form.description.value )
    formData.append ( 'username' , username )
    if (selectedAddressData && selectedAddressData.formattedAddress) {
      formData.append ( 'address' , selectedAddressData.formattedAddress )
    } else if (mapData.address) {
      formData.append ( 'address' , mapData.address )
    }
    if (selectedFiles.length > 0) {
      selectedFiles.forEach ( file => {
        formData.append ( 'houseImages' , file )
      } )
    } // Append houseImages only if there are selected files


    for (let pair of formData.entries ()) {
      console.log ( pair[0] + ': ' + pair[1] )
    }


    try {
      const response = await axios.post ( 'http://localhost:8080/api/houses/create' ,
        formData ,
        {
          headers: {
            'Content-Type': 'multipart/form-data' ,
            Authorization: `Bearer ${token}` ,
          } ,
        } ,
      ) // Send request
      console.log ( 'House created successfully:' , response.data )
      toast.success ( 'House created successfully' )
      navigate ( '/owner' )
    } catch (error) {
      console.error ( 'Error creating house:' , error )
      toast.error ( error )
    }
  }


  return (
    <>
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
                color="warning"
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
                onChange={(newValue) => setMapData ( prev => ({ ...prev , name: newValue }) )}
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
                style={{ overflow: 'hidden' , resize: 'none' }}
                feedbackValid="Introduce your house, amenities, and other information"

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
              multiple
            />
            {error && <div className="text-warning mt-2">{error}</div>}
            <CRow className="mt-4 g-4">
              {previews.map ( (preview , index) => (
                <CCol key={index} xs="auto" className="position-relative">
                  <X
                    size={20}
                    className="position-absolute"
                    style={{
                      top: '18px' ,
                      right: '30px' ,
                      transform: 'translate(50%, -50%)' ,
                      background: 'red' ,
                      color: 'white' ,
                      opacity: '85%' ,
                      borderRadius: '50%' ,
                      padding: '4px' ,
                      cursor: 'pointer' ,
                      zIndex: 3 ,
                    }}
                    onClick={() => removeImage ( index )}
                  />
                  <CImage
                    src={preview.url}
                    alt={`Preview ${index}`}
                    className="object-fit-cover rounded"
                    style={{ width: '8rem' , height: '8rem' }}
                  />
                </CCol>
              ) )}
            </CRow>
          </CCol>


          {/*/!* Submit Button *!/*/}
          <CCol xs={12} className="mt-5">

            <CButton
              color="dark rounded-pill"
              type="submit"
            >
              Add a House
            </CButton>
            <CButton
              color="light rounded-pill"
              className="ms-3"
              onClick={() => navigate ( '/owner' )}
            >
              Cancel
            </CButton>
          </CCol>


        </CForm>
      </CContainer>
    </>
  )
}