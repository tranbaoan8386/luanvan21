import React from 'react'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import productDefault from '../../assets/images/productDefault.png'
import { formatCurrency, generateNameId } from '../../common'
import ProductRating from '../ProudctRating/ProductRating'
import './styles.scss'
import { Link } from 'react-router-dom'
import { BASE_URL_IMAGE } from '../../constants'
export default function ProductItem({ id, img, name, price, promotionPrice, rating, sold, weight }) {
    let photo

    if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
        // Nếu img bắt đầu bằng "http://" hoặc "https://", sử dụng img
        photo = img
    } else if (img) {
        // Nếu có img nhưng không bắt đầu bằng "http://" hoặc "https://", sử dụng BASE_URL_IMAGE + img
        photo = BASE_URL_IMAGE + img
    } else {
        // Nếu không có img, sử dụng productDefault
        photo = productDefault
    }

    return (
        <Link to={`/${generateNameId(name, id)}`} className='grid-item'>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <img height='147.6px' srcSet={photo} alt={name} width='100%' />
                </Box>
                <Box className='wrap-name product-name'>
                    {name}
                </Box>

                <Box>
                    <Typography fontSize='13px' color='#D70018' fontWeight='500' variant='span' >
                        {promotionPrice !== null ? formatCurrency(price) + '₫' : ''}
                    </Typography>

                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ProductRating rating={rating} />

                        <Box padding='0 5px'>|</Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Typography sx={{ ml: '5px' }} fontSize='13px' component='span'>
                                Đã bán {sold}
                            </Typography>


                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1
                    }}
                >



                </Box>

            </Paper>
        </Link>
    )
}
