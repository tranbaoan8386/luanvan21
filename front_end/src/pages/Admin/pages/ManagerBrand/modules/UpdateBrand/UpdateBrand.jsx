import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import TitleManager from '../../../../../../components/Admin/TitleManager'
import Input from '../../../../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createBrand } from '../../../../../../validation/brand'
import { useMutation, useQuery } from '@tanstack/react-query'
import brandApi from '../../../../../../apis/brand'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from "react-toastify";

export default function UpdateBrand() {
    const navigate = useNavigate()
    const { id } = useParams()
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: ''
        },
        resolver: yupResolver(createBrand)
    })

    const { data: brandData } = useQuery({
        query: ['brand'],
        queryFn: () => brandApi.getBrand(id)
    })
    const brand = brandData?.data
    useEffect(() => {
        setValue('name', brand?.name)
    }, [brand])
    const updateBrandMutation = useMutation({
        mutationFn: (mutationPayload) => brandApi.update(mutationPayload.id, mutationPayload.body),
        onSuccess: (data) => {
            navigate('/admin/brand')
        }, onError: () => {
            toast.error('Tên thương hiệu đã bị trùng')
        }
    })

    const onSubmit = handleSubmit((data) => {
        updateBrandMutation.mutate({ id, body: data })
    })
    return (
        <Box>
            <TitleManager>Cập nhật thương hiệu</TitleManager>
            <Box
                onSubmit={onSubmit}
                component='form'
                sx={{ backgroundColor: '#fff', pb: 8, py: 4, px: { xs: 1, md: 4 } }}
            >
                <Grid container>
                    <Grid item md={6} xs={12}>
                        <Box>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Tên thương hiệu
                            </Typography>
                            <Input name='name' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                    </Grid>
                </Grid>
                <Button type='submit' sx={{ mt: 2 }} variant='contained'>
                    Cập nhật thương hiệu
                </Button>
            </Box>
        </Box>
    )
}
