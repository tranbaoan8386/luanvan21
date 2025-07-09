import React from 'react';
import { Link, createSearchParams } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Typography, Box } from '@mui/material';
import './styles.scss';

export default function AsideItem({ data, queryConfig, title, icon, filterBy }) {
  return (
    <div className="filter-wrap" style={{ marginBottom: '20px' }}>
      {/* Tiêu đề rõ ràng hơn */}
      <Box display="flex" alignItems="center" mb={1}>
        <Typography
          fontSize="16px"
          fontWeight={700}
          textTransform="uppercase"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {icon}
          <span style={{ marginLeft: '8px' }}>{title}</span>
        </Typography>
      </Box>

      {/* Danh sách lọc */}
      <ul>
        {data &&
          data.map((itemData) => (
            <li
              key={itemData.id}
              style={{
                color: queryConfig[filterBy] == itemData.id ? '#d32f2f' : '',
                fontWeight: queryConfig[filterBy] == itemData.id ? 600 : 400
              }}
            >
              <Link
                className="filter-link"
                to={{
                  pathname: '/',
                  search: createSearchParams({
                    ...queryConfig,
                    [filterBy]: itemData.id
                  }).toString()
                }}
              >
                <ArrowRightIcon sx={{ mb: '2px', fontSize: '20px', mr: 1 }} />
                <span>{itemData.name}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
