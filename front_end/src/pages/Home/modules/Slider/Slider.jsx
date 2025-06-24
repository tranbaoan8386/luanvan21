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
                    <img srcSet='https://th.bing.com/th/id/R.bc54705d2d8666539acb1136a31938ad?rik=YlU0lopyR4MtCg&riu=http%3a%2f%2ffile.hstatic.net%2f1000058447%2fcollection%2fbanner.aokhoac.shop.paltal.vn_461fee93cd7c44d08c2779cabf7c2f10.jpg&ehk=B2SIQJK56idtIowQiXntS249JzvPEMNzzaCekkw3zeg%3d&risl=&pid=ImgRaw&r=0' alt='' />
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
