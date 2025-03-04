import SearchBarForHouseAvailable from './SearchBarForHouseAvailable'
import HouseList from './house-list/HouseList'
import {useEffect} from "react";
import Banner from './Banner'

export default function Homepage() {
  useEffect(() => {
    document.title = 'Airbnb | Homepage'
  }, [])

  return (
    <>
      <Banner/>
      <SearchBarForHouseAvailable />
      <HouseList/>
    </>
  )
}