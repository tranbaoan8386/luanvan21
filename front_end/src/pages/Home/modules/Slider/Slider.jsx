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
        <Container sx={{ mt: 15, mb: 4 }}>
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
                    <img srcSet='https://vitimex.com.vn/images/products/cat/2023/08/original/banner-ao-khoac_1692413192.jpg' alt='' />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://file.hstatic.net/200000503583/collection/ao-khoac-thu-dong-nam_8b1faa1e5cd44ce9b3e192abcbdb7168.jpg'
                        alt=''
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://dongphuckimvang.vn/uploads/shops/2016_07/ao-gio-ao-khoac-banner.jpg'
                        alt=''
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <img
                        srcSet='https://dongphucphuongthao.vn/wp-content/uploads/2024/09/04092024_Banner-web_1920x900px_DP-ao-khoac.jpg'
                        alt=''
                    />
                </SwiperSlide>
            </Swiper>
        </Container>
    )
}
