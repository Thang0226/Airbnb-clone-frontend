import SearchBarForHouseAvailable from './SearchBarForHouseAvailable'
import HouseList from './HouseList'
import HouseListBeforeSearch from './HouseListBeforeSearch'
import { useEffect, useState } from 'react'

export default function Homepage() {
  const [searchPerformed, setSearchPerformed] = useState(false)
  const handleSearch = (searchData) => {
    setSearchPerformed(true)
  }

  useEffect(() => {
    document.title = 'Airbnb | Homepage'
  }, [])

  return (
    <>
      <SearchBarForHouseAvailable onSearch={handleSearch} />
      {/* Hiển thị HouseList nếu đã tìm kiếm, ngược lại hiển thị HouseListBeforeSearch */}
      {searchPerformed ? <HouseList /> : <HouseListBeforeSearch />}
    </>
  )
}