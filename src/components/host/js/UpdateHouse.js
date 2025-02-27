import { useState , useEffect , useRef } from 'react'
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
import MapSample from './MapSample'
import { BASE_URL_HOUSE } from '../../../constants/api'

export default function UpdateHouse() {
  const [validated , setValidated] = useState ( false )
  const navigate = useNavigate ()
  const { id } = useParams () // House ID
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

  // const dispatch = useDispatch ()
  const token = localStorage.getItem ( 'token' )
  const username = localStorage.getItem ( 'username' )


  // Fetch house data when component mounts
  useEffect ( () => {
    document.title = 'Airbnb | Update House'
    const fetchHouse = async () => {
      try {
        const response = await axios.get ( `${BASE_URL_HOUSE}/${id}` , {
          headers: {
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}` ,
          } ,
        } )
        const house = response.data
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
          file: null ,
          url: `/images/${image.fileName}` ,
          id: image.id , // mark to remove
        }) ) )
      } catch (error) {
        console.error ( 'Error fetching house:' , error )
        toast.error ( 'Failed to fetch house details. Please try again.' )
      }
    }
    fetchHouse ()
  } , [id] )

  // Handle new images
  const handleFileChange = (event) => {
    const files = Array.from ( event.target.files )
    const validFiles = files.filter ( file =>
      file.type === 'image/jpeg' || file.type === 'image/png' ,
    )
    setSelectedFiles ( validFiles ) // Save new image

    // Preview new images + add to existing previews
    const newPreviews = validFiles.map ( file => ({
      file: file ,
      url: URL.createObjectURL ( file ) ,
    }) )
    setPreviews ( [...previews.filter ( p => p.id || !p.file ) , ...newPreviews] )
  }

  // Remove image (existing or new) from previews, send DELETE request for existing
  const removeImage = async (index) => {
    const image = previews[index]
    const newPreviews = [...previews]
    URL.revokeObjectURL ( image.url ) // Clean up the preview URL

    newPreviews.splice ( index , 1 ) // Remove img from preview

    if (image.id) {
      try {
        await axios.delete ( `${BASE_URL_HOUSE}/update/${id}/images/${image.id}` , {
          headers: {
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}` ,
          } ,
        } )
        setPreviews ( newPreviews.filter ( p => p.id !== image.id ) ) // Update previews after deletion
      } catch (error) {
        console.error ( 'Error removing image:' , error )
        toast.error ( 'Failed to remove image. Please try again.' )
      }
    } else if (image.file) {
      // For new images, remove from selectedFiles
      const newFiles = selectedFiles.filter ( (_ , i) => i !== (index - (previews.filter ( p => p.id ).length || 0)) )
      setSelectedFiles ( newFiles )
      setPreviews ( newPreviews )
    }
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

  // Update house data on input change
  const handleChange = (e) => {
    const { name , value } = e.target
    setHouseData ( prev => ({ ...prev , [name]: value }) )
  }

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

    // Keep what image is not removed
    const keptImages = previews.filter ( p => p.id ).map ( p => p.url.split ( '/' ).pop () ) // Filenames of kept existing images
    if (keptImages.length > 0) {
      keptImages.forEach ( filename => formData.append ( 'existingFiles' , filename ) )
    }

    // Add new image if any
    if (selectedFiles.length > 0) {
      selectedFiles.forEach ( file => formData.append ( 'houseImages' , file ) )
    }

    // Log FormData to debug
    for (let pair of formData.entries ()) {
      console.log ( pair[0] + ', ' + pair[1] )
    }

    // Send request to backend
    try {
      const response = await axios.put ( `${BASE_URL_HOUSE}/update/${id}` ,
        formData ,
        {
          headers: {
            'Content-Type': 'multipart/form-data' ,
            'Authorization': `Bearer ${token}` ,
          } ,
        } ,
      )
      console.log ( 'House updated successfully:' , response.data )
      toast.success ( 'House updated successfully' )
      navigate ( '/host' )
    } catch (error) {
      console.error ( 'Error updating house:' , error )
      toast.error ( 'Failed to update house. Please try again.' )
    }
  }


  // Add new images via POST request when file input changes
  const handleAddImages = async (event) => {
    const files = Array.from ( event.target.files )
    const validFiles = files.filter ( file =>
      file.type === 'image/jpeg' || file.type === 'image/png' ,
    )

    if (validFiles.length > 0) {
      const formData = new FormData ()
      validFiles.forEach ( file => formData.append ( 'images' , file ) )

      try {
        await axios.post ( `${BASE_URL_HOUSE}/${id}/images` , formData , {
          headers: {
            'Content-Type': 'multipart/form-data' ,
            'Authorization': `Bearer ${token}` ,
          } ,
        } )
        // Fetch updated house to refresh previews
        const response = await axios.get ( `${BASE_URL_HOUSE}/${id}` )
        setPreviews ( response.data.houseImages.map ( img => ({
          file: null ,
          url: `/images/${img.fileName}` ,
          id: img.id ,
        }) ) )
        toast.success ( 'Images added successfully' )
      } catch (error) {
        console.error ( 'Error adding images:' , error )
        toast.error ( 'Failed to add images. Please try again.' )
      }
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
              onChange={handleAddImages}
              multiple
            />
            {/* Preview */}
            <CRow className="mt-4 g-4">
              {previews.filter ( p => p.url !== '/images/default.png' ).map ( (preview , index) => (
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

          {/* Submit & Cancel */}
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