import { CCarousel, CCarouselItem, CImage } from '@coreui/react'
import "./homepage.css"

export default function Banner() {

  return (
    <CCarousel controls interval={3000}>
      <CCarouselItem>
        <CImage className="d-block w-100 banner" src="/hero/banner_1.png" alt="slide 1" />
      </CCarouselItem>
      <CCarouselItem>
        <CImage className="d-block w-100 banner" src="/hero/banner_2.png" alt="slide 2" />
      </CCarouselItem>
      <CCarouselItem>
        <CImage className="d-block w-100 banner" src="/hero/banner_3.png" alt="slide 3" />
      </CCarouselItem>
    </CCarousel>
  )
}