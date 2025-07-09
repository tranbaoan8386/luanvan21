import { Box, Container } from '@mui/material'
import React from 'react'
import ProductList from './modules/ProductList'
import Slider from './modules/Slider'

export default function Home() {
  return (
    <Box sx={{ mb: 3 }}>
      <Slider />
      <Container maxWidth="xl"> {/* 👈 Giới hạn lại không quá to */}
        <ProductList />
      </Container>
    </Box>
  )
}
