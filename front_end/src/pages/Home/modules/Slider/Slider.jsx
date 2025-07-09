import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Import custom CSS
import './styles.scss'

// Import Swiper modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules'

// Import MUI Container
import { Container } from '@mui/material'

export default function Slider() {
  return (
    <Container maxWidth="xl" sx={{ mt: 15, mb: 4 }}>
      <Swiper
        slidesPerView={1}
        loop={true}
        spaceBetween={10}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        navigation={true}
        modules={[Autoplay, Navigation, Pagination]}
        className='mySwiper'
      >
        <SwiperSlide>
          <img
            src='https://mayaokhoacdongphuc.com/wp-content/uploads/2024/06/banner-dong-phuc-garico-010101-1.jpg'
            alt='Banner 1'
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src='https://file.hstatic.net/200000503583/collection/ao-khoac-thu-dong-nam_8b1faa1e5cd44ce9b3e192abcbdb7168.jpg'
            alt='Banner 2'
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src='https://dongphuckimvang.vn/uploads/shops/2016_07/ao-gio-ao-khoac-banner.jpg'
            alt='Banner 3'
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src='https://aokhoacxanh.com/wp-content/uploads/2021/09/banner-ao-khoac-1400x551-1.jpg'
            alt='Banner 4'
          />
        </SwiperSlide>
      </Swiper>
    </Container>
  )
}
