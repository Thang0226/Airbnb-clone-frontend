import SearchBarForHouseAvailable from './SearchBarForHouseAvailable'
import HouseList from './HouseList'
import {useEffect} from "react";
import TopFiveHousesSlider from './TopFiveHouses'

export default function Homepage() {
  useEffect(() => {
    document.title = 'Airbnb | Homepage'
  }, [])

  return (
    <>
      <SearchBarForHouseAvailable />
      <TopFiveHousesSlider/>
      <HouseList/>
    </>
  )
}