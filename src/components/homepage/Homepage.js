import SearchBarForHouseAvailable from './SearchBarForHouseAvailable'
import HouseList from './HouseList'
import {useEffect} from "react";

export default function Homepage() {

  useEffect(() => {
    document.title = 'Airbnb | Homepage'
  }, [])

  return (
    <>
      <SearchBarForHouseAvailable />
      <HouseList/>
    </>
  )
}