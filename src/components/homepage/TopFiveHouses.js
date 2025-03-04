import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { CContainer } from '@coreui/react'

const MySlider = () => {
  return (
    <CContainer>
      <Swiper slidesPerView={3} spaceBetween={20} navigation modules={[Navigation]}>
        {rooms.map((room) => (
          <SwiperSlide key={room.id}>
            <div className="p-4 bg-white shadow-md rounded-lg">
              <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover rounded-md" />
              <h3 className="mt-2 text-lg font-bold">{room.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </CContainer>
  );
};

export default MySlider;
