import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography } from '@mui/material';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { createSearchParams, useNavigate } from 'react-router-dom';
import InputNumber from '../../../../../../components/InputNumber';
import MyButton from '../../../../../../components/MyButton';
import { filterPriceSchema } from '../../../../../../validation/product';

export default function FilterPriceRange({ queryConfig }) {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(filterPriceSchema)
  });

  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: '/',
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    });
  });

  return (
    <form onSubmit={onSubmit} action=''>
      <div className='filter-wrap'>
        {/* ✅ Tiêu đề rõ hơn bằng Typography */}
        <Typography
          fontSize="16px"
          fontWeight={700}
          textTransform="uppercase"
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        >
          <BiMoneyWithdraw style={{ marginRight: 8 }} />
          Khoảng giá
        </Typography>

        <ul>
          <li className='no-pl'>
            <Controller
              name='price_min'
              control={control}
              render={({ field }) => (
                <InputNumber
                  ref={field.ref}
                  value={field.value}
                  placeholder='đ Từ'
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('price_max');
                  }}
                />
              )}
            />
            <span>-</span>
            <Controller
              name='price_max'
              control={control}
              render={({ field }) => (
                <InputNumber
                  value={field.value}
                  placeholder='đ Đến'
                  onChange={(e) => {
                    field.onChange(e);
                    trigger('price_min');
                  }}
                />
              )}
            />
          </li>

          <Typography fontSize='13px' color='error' component='p'>
            {errors.price_min?.message}
          </Typography>

          <MyButton type='submit' mt='8px' width='100%'>
            Áp dụng
          </MyButton>
        </ul>
      </div>
    </form>
  );
}
