import { Box, Button, Grid, Typography } from '@mui/material'
import React from 'react'
import TitleManager from '../../../../../../components/Admin/TitleManager'
import Input from '../../../../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import couponApi from '../../../../../../apis/coupon'

const createCouponSchema = yup.object({
  code: yup.string().required('Vui lòng nhập mã'),
  price: yup
    .number()
    .typeError('Giá trị phải là số')
    .min(1, 'Giá trị phải lớn hơn 0')
    .required('Vui lòng nhập giá trị'),
  startDate: yup.string().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.string().required('Vui lòng chọn ngày kết thúc'),
  minimumAmount: yup
    .number()
    .typeError('Giá trị phải là số')
    .min(0, 'Không được nhỏ hơn 0')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
})

export default function CreateCoupon() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createCouponSchema)
  })

  const addCouponMutation = useMutation({
    mutationFn: (body) => couponApi.createCoupon(body),
    onSuccess: () => {
      navigate('/admin/coupon')
    }
  })

  const onSubmit = handleSubmit((data) => {
    console.log("📦 Dữ liệu gửi:", data);
    addCouponMutation.mutate(data)
  })

  return (
    <Box>
      <TitleManager>Thêm mã khuyến mãi</TitleManager>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ backgroundColor: '#fff', pb: 8, py: 4, px: { xs: 1, md: 4 } }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography component="p" sx={{ mb: 1 }}>
              Mã khuyến mãi
            </Typography>
            <Input name="code" register={register} errors={errors} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="p" sx={{ mb: 1 }}>
              Giá trị (VND)
            </Typography>
            <Input name="price" type="number" register={register} errors={errors} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="p" sx={{ mb: 1 }}>
              Ngày bắt đầu
            </Typography>
            <Input name="startDate" type="date" register={register} errors={errors} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="p" sx={{ mb: 1 }}>
              Ngày kết thúc
            </Typography>
            <Input name="endDate" type="date" register={register} errors={errors} fullWidth size="small" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="p" sx={{ mb: 1 }}>
              Đơn hàng tối thiểu (VND)
            </Typography>
            <Input name="minimumAmount" type="number" register={register} errors={errors} fullWidth size="small" />
          </Grid>
        </Grid>
        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
          Thêm mã
        </Button>
      </Box>
    </Box>
  )
}
