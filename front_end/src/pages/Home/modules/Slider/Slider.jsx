import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './styles.scss'
import { Pagination, Navigation, Autoplay } from 'swiper/modules'
import { Container } from '@mui/material'

export default function Slider() {
    return (
        <Container sx={{ mt: 2, mb: 4 }}>
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
                    <img srcSet='https://ironstyle.vn/public/uploads/slide/uAhT_Tranh-treo-tuong.jpg' alt='' />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://ironstyle.vn/public/uploads/slide/ui11_do-decor-phong-khach.jpg'
                        alt=''
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://ironstyle.vn/public/uploads/slide/yIKD_binh-lo-cam-hoa.jpg'
                        alt=''
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://ironstyle.vn/public/uploads/slide/fEoS_cay-va-hoa-gia-decor.jpg'
                        alt=''
                    />
                </SwiperSlide>
            </Swiper>
        </Container>
    )
}
