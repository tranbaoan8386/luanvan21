import React from 'react';
import { Box, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import productDefault from '../../assets/images/productDefault.png';
import { formatCurrency, generateNameId } from '../../common';
import ProductRating from '../ProudctRating/ProductRating';
import './styles.scss';
import { Link } from 'react-router-dom';

export default function ProductItem({
  id,
  img,
  name,
  price,
  promotionPrice,
  rating = 0,
  sold = 0,
  weight,
}) {
  const photo =
    img && typeof img === 'string' && img.trim() !== '' ? img : productDefault;

  return (
    <Link to={`/${generateNameId(name, id)}`} className="grid-item">
      <Paper sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <img height="147.6px" src={photo} alt={name} width="100%" />
        </Box>

        <Box className="wrap-name product-name" sx={{ mt: 1 }}>
          {name}
        </Box>

        <Box sx={{ mt: 1 }}>
          {price ? (
            promotionPrice !== null ? (
              <>
                <Typography fontSize="13px" color="#D70018" fontWeight="bold">
                  {formatCurrency(promotionPrice)} VND
                </Typography>
                <Typography
                  fontSize="12px"
                  sx={{ textDecoration: 'line-through', color: '#888' }}
                >
                  {formatCurrency(price)} VND
                </Typography>
              </>
            ) : (
              <Typography fontSize="13px" color="#D70018" fontWeight="500">
                {formatCurrency(price)} VND
              </Typography>
            )
          ) : (
            <Typography fontSize="13px" color="#D70018" fontWeight="500">
              Liên hệ
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ProductRating rating={rating} />
            <Box padding="0 5px">|</Box>
            <Typography fontSize="13px" color="blue" component="span">
              Đã bán {sold}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Link>
  );
}
