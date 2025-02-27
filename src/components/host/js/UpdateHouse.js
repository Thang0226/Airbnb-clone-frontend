import { useState , useEffect , useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate , useParams } from 'react-router-dom'
import axios from 'axios'
import {
  CContainer ,
  CForm ,
  CCol ,
  CFormFloating ,
  CFormInput ,
  CFormTextarea ,
  CFormLabel ,
  CRow ,
  CImage ,
  CCloseButton ,
  CButton ,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { setHouse } from '../../../redux/slices/houseSlice'
import MapSample from './MapSample'
import { BASE_URL_HOUSE } from '../../../constants/api'

export default function UpdateHouse() {
  const [validated , setValidated] = useState ( false )
  const navigate = useNavigate ()
  const { houseId } = useParams ()
  const dispatch = useDispatch ()
  const token = localStorage.getItem ( 'token' )
  const username = localStorage.getItem ( 'username' )

  // State for form data
  const [houseData , setHouseData] = useState ( {
    houseName: '' ,
    address: '' ,
    bedrooms: '' ,
    bathrooms: '' ,
    description: '' ,
    price: '' ,
  } )
  const [selectedFiles , setSelectedFiles] = useState ( [] )
  const [previews , setPreviews] = useState ( [] )
  const [mapData , setMapData] = useState ( { name: '' , address: '' } )
  const [selectedAddressData , setSelectedAddressData] = useState ( null )
  const textareaRef = useRef ( null )

  useEffect ( () => {
    document.title = 'Airbnb | Update House'
    const fetchHouse = async () => {
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/${id}` , {
          headers: {
            Authorization: `Bearer ${token}` ,
          } ,
        } )

        const house = response.data
        console.log ( house )
        setHouseData ( {
          houseName: house.houseName ,
          address: house.address ,
          bedrooms: house.bedrooms ,
          bathrooms: house.bathrooms ,
          description: house.description ,
          price: house.price ,
        } )
        setMapData ( { name: house.address , address: house.address } )
        setPreviews ( house.houseImages.map ( image => ({
          file: null , // No file for existing images, just a URL
          url: `/images/${image.fileName}` , // Assuming images are served this way
        }) ) )
      } catch (error) {
        console.error ( 'Error fetching house:' , error )
        toast.error ( 'Failed to fetch house details. Please try again.' )
      }
    }
    fetchHouse ()
  } , [houseId , token] )

  // Handle new images
  const handleFileChange = (event) => {
    const files = Array.from ( event.target.files )
    const validFiles = files.filter ( file =>
      file.type === 'image/jpeg' || file.type === 'image/png' ,
    )
    setSelectedFiles ( validFiles )

    const newPreviews = validFiles.map ( file => ({
      file: file ,
      url: URL.createObjectURL ( file ) ,
    }) )

    // Clean up old preview URLs for new files only
    previews.filter ( p => p.file ).forEach ( p => URL.revokeObjectURL ( p.url ) )
    setPreviews ( [...previews.filter ( p => !p.file ) , ...newPreviews] ) // Keep existing images, add new ones
  }

  // Remove image (existing or new)
  const removeImage = (index) => {
    const newPreviews = [...previews]
    const newFiles = [...selectedFiles]

    // Clean up the preview URL
    URL.revokeObjectURL ( previews[index].url )

    newPreviews.splice ( index , 1 )
    if (previews[index].file) {
      newFiles.splice ( index - (previews.length - selectedFiles.length) , 1 )
    }

    setPreviews ( newPreviews )
    setSelectedFiles ( newFiles )
  }

  // For address input
  const handleAddressSelect = (addressData) => {
    const formattedAddress = addressData.formattedAddress || ''
    setMapData ( {
      name: formattedAddress ,
      address: formattedAddress ,
    } )
    setSelectedAddressData ( addressData )
  }

  // Make CFormTextarea expandable
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

  // Handle form submission for updating
  const handleSubmit = async (event) => {
    event.preventDefault ()

    const form = event.currentTarget
    if (form.checkValidity () === false) {
      event.stopPropagation ()
      setValidated ( true )
      return
    }

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

    // Append new house images
    if (selectedFiles.length > 0) {
      selectedFiles.forEach ( file => {
        formData.append ( 'houseImages' , file )
      } )
    }

    // Log FormData
    for (let pair of formData.entries ()) {
      console.log ( pair[0] + ', ' + pair[1] )
    }

    try {
      const response = await axios.put ( `${BASE_URL_HOUSE}/update/${id}` ,
        formData ,
        {
          headers: {
            'Content-Type': 'multipart/form-data' ,
            Authorization: `Bearer ${token}` ,
          } ,
        } ,
      )
      console.log ( 'House updated successfully:' , response.data )
      toast.success ( 'House updated successfully' )
      dispatch ( setHouse ( response.data ) ) // Update Redux if needed
      navigate ( '/host' )
    } catch (error) {
      console.error ( 'Error updating house:' , error )
      toast.error ( 'Failed to update house. Please try again.' )
    }
  }

  return (
    <>
      <CContainer className="py-lg-5 py-3 w-50">
        <h1 className="my-4">🏡 Update House</h1>
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
                value={houseData.houseName}
                onChange={(e) => setHouseData ( { ...houseData , houseName: e.target.value } )}
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

          {/* Bedrooms */}
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput
                type="number"
                placeholder="Number of Bedrooms"
                id="bedrooms"
                name="bedrooms"
                value={houseData.bedrooms}
                onChange={(e) => setHouseData ( { ...houseData , bedrooms: e.target.value } )}
                min={1}
                max={10}
                feedbackInvalid="Please enter number of bedrooms (1-10)"
                required
              />
              <CFormLabel htmlFor="bedrooms">Number of Bedrooms</CFormLabel>
            </CFormFloating>
          </CCol>

          {/* Bathrooms */}
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput
                type="number"
                placeholder="Number of Bathrooms"
                id="bathrooms"
                name="bathrooms"
                value={houseData.bathrooms}
                onChange={(e) => setHouseData ( { ...houseData , bathrooms: e.target.value } )}
                min={1}
                max={3}
                feedbackInvalid="Please enter number of bathrooms (1-3)"
                required
              />
              <CFormLabel htmlFor="bathrooms">Number of Bathrooms</CFormLabel>
            </CFormFloating>
          </CCol>

          {/* Description */}
          <CCol xs={12}>
            <CFormFloating>
              <CFormTextarea
                placeholder="Description"
                id="description"
                name="description"
                value={houseData.description}
                onChange={(e) => setHouseData ( { ...houseData , description: e.target.value } )}
                rows={3}
                ref={textareaRef}
                style={{ overflow: 'hidden' , resize: 'none' }}
                feedbackValid="Introduce your house, amenities, and other information"
              />
              <CFormLabel htmlFor="description">Description</CFormLabel>
            </CFormFloating>
          </CCol>

          {/* Price */}
          <CCol xs={12}>
            <CFormFloating>
              <CFormInput
                type="number"
                placeholder="Enter price (VND)"
                id="price"
                name="price"
                value={houseData.price}
                onChange={(e) => setHouseData ( { ...houseData , price: e.target.value } )}
                min={100000}
                feedbackInvalid="Please enter price per day in VND (min 100.000)"
                required
              />
              <CFormLabel htmlFor="price">Enter price per day (VND)</CFormLabel>
            </CFormFloating>
          </CCol>

          {/* Image */}
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
            {/* Preview */}
            <CRow className="mt-4 g-4">
              {previews.map ( (preview , index) => (
                <CCol key={index} xs="auto" className="position-relative">
                  <CCloseButton
                    className="position-absolute top-0 end-0 rounded-circle p-1"
                    color="white"
                    onClick={() => removeImage ( index )}
                  />
                  <CImage
                    src={preview.url}
                    alt={`Preview ${index}`}
                    className="object-fit-cover rounded"
                    style={{ width: '6rem' , height: '6rem' }}
                  />
                </CCol>
              ) )}
            </CRow>
          </CCol>

          {/* Submit Button */}
          <CCol xs={12} className="mt-5">
            <CButton
              color="dark"
              shape="rounded-pill"
              type="submit"
            >
              Update House
            </CButton>
            <CButton
              color="light"
              shape="rounded-pill"
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