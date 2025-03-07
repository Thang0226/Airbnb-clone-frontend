import { useState , useEffect , useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
  CButton ,
} from '@coreui/react'
import { toast } from 'react-toastify'
import { setHouse } from '../../../redux/slices/houseSlice'
import MapSample from './MapSample'
import ImageUploader from './ImageUploader'
import { BASE_URL_HOUSE } from '../../../constants/api'


export default function UpdateHouse() {
  const [validated , setValidated] = useState ( false )
  const navigate = useNavigate ()
  const { houseId } = useParams ()
  const dispatch = useDispatch ()
  const token = useSelector(state => state.account.token)
  const username = useSelector(state => state.account.username)

  const [isLoading , setIsLoading] = useState ( true )

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
    setIsLoading ( true )
    const fetchHouse = async () => {
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/${houseId}` , {
          headers: {
            Authorization: `Bearer ${token}` ,
          } ,
        } )

        const house = response.data
        console.log ( 'House Response Data' , house )

        setHouseData ( {
          houseName: house.houseName ,
          address: house.address ,
          bedrooms: house.bedrooms ,
          bathrooms: house.bathrooms ,
          description: house.description ,
          price: house.price ,
        } )

        setMapData ( { name: house.address , address: house.address } )
        setIsLoading ( false )
      } catch (error) {
        console.error ( 'Error fetching house:' , error )
        toast.error ( 'Failed to fetch house details. Please try again.' )
        setIsLoading ( false )
      }
    }
    fetchHouse ()
  } , [houseId , token] )


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

    // Image handling
    // 1. Existing images that weren't removed
    const existingImageIds = previews
      .filter ( preview => preview.isExisting && preview.id )
      .map ( preview => preview.id )

    // If we have existing image IDs, add them to formData
    if (existingImageIds.length > 0) {
      existingImageIds.forEach ( id => {
        formData.append ( 'existingImageIds' , id )
      } )
    }

    // 2. New images being uploaded (added with existing images)
    if (selectedFiles.length > 0) {
      selectedFiles.forEach ( (file) => {
        formData.append ( 'houseImages' , file )
      } )
    }
    console.log ( selectedFiles )

    // Log FormData
    for (let pair of formData.entries ()) {
      console.log ( pair[0] + ', ' + pair[1] )
    }

    try {
      setIsLoading ( true )

      const response = await axios.put (
        `${BASE_URL_HOUSE}/update/${houseId}` ,
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
      console.error ( 'Error response data:' , error.response.data )
      toast.error ( 'Failed to update house. Please try again.' )
      setIsLoading ( false )
    }
  }

  if (isLoading) {
    return <CContainer className="py-5">
      <div>Loading house details...</div>
    </CContainer>
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
            <ImageUploader
              houseId={houseId}
              previews={previews}
              setPreviews={setPreviews}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
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
              onClick={() => navigate ( '/host' )}
            >
              Cancel
            </CButton>
          </CCol>
        </CForm>
      </CContainer>
    </>
  )
}