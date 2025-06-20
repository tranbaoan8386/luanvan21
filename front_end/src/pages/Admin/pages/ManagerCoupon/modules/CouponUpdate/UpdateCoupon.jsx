import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import TitleManager from '../../../../../../components/Admin/TitleManager'
import Input from '../../../../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import couponApi from '../../../../../../apis/coupon'

// Schema validate giống khi tạo
const updateCouponSchema = yup.object({
  code: yup.string().required('Vui lòng nhập mã'),
  price: yup
    .number()
    .typeError('Giá trị phải là số')
    .min(1, 'Giá trị phải lớn hơn 0')
    .required('Vui lòng nhập giá trị'),
  startDate: yup.string().required('Vui lòng chọn ngày bắt đầu'),
  endDate: yup.string().required('Vui lòng chọn ngày kết thúc')
})

export default function UpdateCoupon() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(updateCouponSchema)
  })

  // Lấy dữ liệu mã cần sửa
  const { data: couponData } = useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponApi.getCouponById(id)
  })

  const coupon = couponData?.data?.coupon

  useEffect(() => {
    if (coupon) {
      setValue('code', coupon.code)
      setValue('price', coupon.price)
      setValue('startDate', coupon.startDate?.slice(0, 10))
      setValue('endDate', coupon.endDate?.slice(0, 10))
    }
  }, [coupon])

  const updateCouponMutation = useMutation({
    mutationFn: (payload) => couponApi.updateCoupon(payload.id, payload.body),
    onSuccess: () => {
      navigate('/admin/coupon')
    }
  })

  const onSubmit = handleSubmit((data) => {
    updateCouponMutation.mutate({ id, body: data })
  })

  return (
    <Box>
      <TitleManager>Sửa mã khuyến mãi</TitleManager>
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
        </Grid>
        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
          Cập nhật mã
        </Button>
      </Box>
    </Box>
  )
}
