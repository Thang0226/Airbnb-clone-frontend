import SearchBarForHouseAvailable from './SearchBarForHouseAvailable'
import HouseList from './house-list/HouseList'
import {useEffect} from "react";
import Banner from './Banner'
import TopFiveHousesSlider from './TopFiveHouses'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../redux/slices/chatSlice'

export default function Homepage() {
  useEffect(() => {
    document.title = 'Airbnb | Homepage'
  }, [])


  const dispatch = useDispatch()
  useEffect(() => {
    const updateUser = () => dispatch(setCurrentUser({
      id: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
    }));
    window.addEventListener('storage', updateUser);
    updateUser();
    return () => window.removeEventListener('storage', updateUser);
  }, [dispatch]);

  return (
    <>
      <Banner/>
      <SearchBarForHouseAvailable />
      <TopFiveHousesSlider/>
      <HouseList/>
    </>
  )
}