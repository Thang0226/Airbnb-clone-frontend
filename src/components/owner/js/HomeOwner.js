import BodyOwner from './BodyOwner'
import { useEffect } from 'react'

function HomeOwner() {

  useEffect(() => {
    document.title = 'Airbnb | Host'
  }, [])

  return (
    <div>
      <BodyOwner />
    </div>
  )
}

export default HomeOwner