import { useState , useEffect } from 'react'
import {
  CFormInput ,
  CFormLabel ,
  CRow ,
  CCol ,
  CImage ,
  CCloseButton ,
} from '@coreui/react'
import axios from 'axios'
import { BASE_URL , BASE_URL_HOUSE } from '../../../constants/api'

export default function ImageUploader({ houseId , previews , setPreviews , selectedFiles , setSelectedFiles }) {
  const [isLoading , setIsLoading] = useState ( true )
  const token = localStorage.getItem ( 'token' )

  useEffect ( () => {
    // Only fetch images if we have a houseId (editing an existing house)
    if (houseId) {
      setIsLoading ( true )
      axios.get ( `${BASE_URL_HOUSE}/${houseId}/images`)
        .then ( (res) => {
          // Filter out default images from preview display
          const nonDefaultImages = res.data.filter ( image => image.fileName !== 'default.png' )

          // If we have actual images, set them as previews
          if (nonDefaultImages.length > 0) {
            setPreviews ( nonDefaultImages.map ( image => ({
              id: image.id ,
              file: null , // Existing images don't have file objects
              url: `${BASE_URL}/images/${image.fileName}` ,
              isExisting: true , // Flag to identify existing images
            }) ) )
          } else {
            // No images or only default image, start with empty previews
            setPreviews ( [] )
          }
          setIsLoading ( false )
        } )
        .catch ( (error) => {
          console.error ( 'Error fetching images:' , error )
          setIsLoading ( false )
        } )
    } else {
      setIsLoading ( false )
    }
  } , [houseId , setPreviews , token] )


  const handleFileChange = (event) => {
    const files = Array.from ( event.target.files )
    const validFiles = files.filter ( file => file.type === 'image/jpeg' || file.type === 'image/png' )

    setSelectedFiles ( [...selectedFiles , ...validFiles] )

    const newPreviews = validFiles.map ( file => ({
      file: file ,
      url: URL.createObjectURL ( file ) ,
      isExisting: false , // New uploads are not existing images
    }) )

    setPreviews ( [...previews , ...newPreviews] )

    // Clear the input value to allow selecting the same files again
    event.target.value = null
  }

  const removeImage = (index) => {
    const imageToRemove = previews[index]

    // If it's an existing image, we'll just remove it from previews
    // The actual deletion happens during form submission
    if (imageToRemove.id) {
      setPreviews ( previews.filter ( (_ , i) => i !== index ) )
    } else {
      // For newly added images, revoke the object URL to prevent memory leaks
      URL.revokeObjectURL ( imageToRemove.url )
      // Find the index in selectedFiles
      const fileIndex = selectedFiles.findIndex ( file =>
        file.name === imageToRemove.file.name &&
        file.size === imageToRemove.file.size ,
      )

      if (fileIndex !== -1) {
        setSelectedFiles ( selectedFiles.filter ( (_ , i) => i !== fileIndex ) )
      }

      setPreviews ( previews.filter ( (_ , i) => i !== index ) )
    }
  }

  return (
    <>
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
        {isLoading ? (
          <CCol>Loading images...</CCol>
        ) : previews.length > 0 ? (
          previews.map ( (preview , index) => (
            <CCol key={index} xs="auto" className="position-relative">
              <CCloseButton
                className="position-absolute top-0 end-0 rounded-circle p-1 bg-white"
                onClick={() => removeImage ( index )}
              />
              <CImage
                src={preview.url}
                alt={`Preview ${index}`}
                className="object-fit-cover rounded shadow"
                style={{ width: '6rem' , height: '6rem' }}
              />
            </CCol>
          ) )
        ) : (
          <CCol>No images uploaded yet. Upload images to display them here.</CCol>
        )}
      </CRow>
    </>
  )
}