import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { HouseForm } from './HouseForm'; // Adjust import path as needed
import { setHouse } from '../../../redux/slices/houseSlice'; // Adjust import path as needed
import { BASE_URL_HOUSE } from '../../../constants/api'

export default function UpdateHouse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const house = useSelector(state => state.houses.house);

  useEffect(() => {
    document.title = 'Airbnb | Update House';
    const fetchHouse = async () => {
      try {
        const response = await axios.get(`${BASE_URL_HOUSE}/${id}`);
        dispatch(setHouse(response.data));
      } catch (error) {
        console.error('Error fetching house:', error);
      }
    };
    if (!house) fetchHouse();
  }, [id, dispatch, house]);

  const initialValues = house || {
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
    const response = await axios.put(`http://localhost:8080/api/houses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(setHouse(response.data));
  };

  return (
    <HouseForm initialValues={initialValues} onSubmit={handleSubmit} mode="update" />
  );
}