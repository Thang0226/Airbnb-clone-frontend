import { HouseForm } from './HouseForm'; // Adjust import path as needed
import axios from 'axios';
import { useEffect } from 'react'
import { BASE_URL_HOUSE } from '../../../constants/api'

export default function CreateHouse() {
  useEffect(() => {
    document.title = 'Airbnb | Add House';
  }, []);

  const initialValues = {
    houseName: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    price: '',
    houseImages: [],
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => formData.append(key, values[key]));
    await axios.post(`${BASE_URL_HOUSE}/create`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  return (
    <HouseForm initialValues={initialValues} onSubmit={handleSubmit} mode="create" />
  );
}