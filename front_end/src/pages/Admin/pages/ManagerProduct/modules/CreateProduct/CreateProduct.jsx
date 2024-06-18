import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Box, FormControl, Button, Grid, MenuItem, Select, TextField, Typography, FormHelperText } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { Fragment, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import Input from '../../../../../../components/Input'
import TitleManager from '../../../../../../components/Admin/TitleManager'
import Editor from '../../../../../../components/Admin/Editor/Editor'
import categoryApi from '../../../../../../apis/category'
import colorApi from '../../../../../../apis/color'
import { yupResolver } from '@hookform/resolvers/yup'
import { createProductSchema } from '../../../../../../validation/product'
import productApi from '../../../../../../apis/product'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
})

export default function CreateProduct() {
    const navigate = useNavigate()
    const [image, setImage] = useState('')
    const previewImage = useMemo(() => {
        return image ? URL.createObjectURL(image) : ''
    }, [image])
    const [description, setDescription] = useState('')
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setError
    } = useForm({
        defaultValues: {
            name: '',
            price: '',
            sold: '',
            unitlnStock: '',
            productCouponId: '',
            colorId: [],
            categoryId: ''
        },
        resolver: yupResolver(createProductSchema)
    })
    // Get categories
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryApi.getAllCategory
    })
    const categories = categoriesData?.data || []

    // Get colors
    const { data: colorsData } = useQuery({
        queryKey: ['colors'],
        queryFn: colorApi.getAllColor
    })
    const colors = colorsData?.data || []

    const handleChangePhoto = (e) => {
        const fileFromLocal = e.target.files?.[0]
        setImage(fileFromLocal)
    }

    const createProductMutation = useMutation({
        mutationFn: productApi.createProduct,
        onSuccess: () => {
            navigate('/admin/product')
        },
        onError: (error) => {
            if (error.response?.status === 500) {
                toast.error(error.response?.data.message)
            } else if (error.response?.status === 400) {
                const formError = error.response?.data.data
                if (formError) {
                    Object.keys(formError).forEach((key) => {
                        setError(key, {
                            type: 'manual',
                            message: formError[key]
                        })
                    })
                }
            }
        }
    })

    const onSubmit = handleSubmit((data) => {
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('price', data.price)
        formData.append('sold', data.sold)
        formData.append('unitlnStock', data.unitlnStock)
        formData.append('productCouponId', data.productCouponId)
        formData.append('description', description)
        formData.append('categoryId', data.categoryId)
        formData.append('image', image)
        data.colorId.forEach((id) => {
            formData.append('colorId[]', id)
        })
        createProductMutation.mutate(formData)
    })

    return (
        <Box>
            <TitleManager>Thêm sản phẩm</TitleManager>
            <Box onSubmit={onSubmit} component='form' sx={{ backgroundColor: '#fff', pb: 8, px: { xs: 1, md: 4 } }}>
                <Grid container spacing={5}>
                    <Grid item md={6} xs={12}>
                        <Box>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Tên sản phẩm
                            </Typography>
                            <Input name='name' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                sold
                            </Typography>
                            <Input name='sold' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Số lượng tồn
                            </Typography>
                            <Input name='unitlnStock' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Giá tiền
                            </Typography>
                            <Input
                                type='number'
                                name='price'
                                register={register}
                                errors={errors}
                                fullWidth
                                size='small'
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Mã khuyến mãi
                            </Typography>
                            <Input
                                type='number'
                                name='productCouponId'
                                register={register}
                                errors={errors}
                                fullWidth
                                size='small'
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Mô tả sản phẩm
                            </Typography>
                            <Editor onContentChange={setDescription} />
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FormControl fullWidth>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Loại sản phẩm
                            </Typography>

                            <Controller
                                name='categoryId'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        size='small'
                                        error={Boolean(errors.categoryId?.message)}
                                        labelId='demo-simple-select-label'
                                        id='demo-simple-select'
                                    >
                                        {categories.map((category) => (
                                            <MenuItem value={category.id} key={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText error={!!errors.categoryId?.message}>{errors.categoryId?.message}</FormHelperText>
                        </FormControl>
                        <FormControl sx={{ mt: 2 }} fullWidth>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Màu
                            </Typography>
                            <Controller
                                name='colorId'
                                control={control}
                                render={({ field }) => (
                                    <Fragment>
                                        {colors.map((color) => (
                                            <Box key={color.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <input
                                                    id={color.id}
                                                    type="checkbox"
                                                    value={color.id}
                                                    checked={field.value.includes(color.id)}
                                                    onChange={(e) => {
                                                        const selectedColors = e.target.checked
                                                            ? [...field.value, color.id]
                                                            : field.value.filter((id) => id !== color.id)
                                                        field.onChange(selectedColors)
                                                    }}
                                                />
                                                <Typography sx={{ ml: 1 }}>{color.name}</Typography>
                                            </Box>
                                        ))}
                                    </Fragment>
                                )}
                            />
                            <FormHelperText error={!!errors.colorId?.message}>{errors.colorId?.message}</FormHelperText>
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Hình ảnh
                            </Typography>
                            <Button
                                sx={{ width: '200px', py: 1 }}
                                component='label'
                                variant='outlined'
                                color='success'
                                startIcon={<CloudUploadIcon />}
                            >
                                Chọn file
                                <VisuallyHiddenInput onChange={handleChangePhoto} accept='image/*' type='file' />
                            </Button>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            {previewImage && (
                                <img
                                    style={{ borderRadius: '5px' }}
                                    width='200'
                                    src={previewImage}
                                    alt='product-image'
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Button type='submit' sx={{ width: '200px', mt: 2 }} variant='contained'>
                    Thêm sản phẩm
                </Button>
            </Box>
        </Box>
    )
}
