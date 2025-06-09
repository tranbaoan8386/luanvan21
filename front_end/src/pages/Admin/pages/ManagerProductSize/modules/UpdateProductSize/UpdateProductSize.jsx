
import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import TitleManager from '../../../../../../components/Admin/TitleManager'
import Input from '../../../../../../components/Input'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { createProductSizeSchema } from '../../../../../../validation/productSize'
import sizeApi from '../../../../../../apis/size'

export default function UpdateProductSize() {
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
        resolver: yupResolver(createProductSizeSchema)
    })

    const { data: sizeData } = useQuery({
        query: ['size'],
        queryFn: () => sizeApi.getSize(id)
    })
    const size = sizeData?.data
    useEffect(() => {
        setValue('name', size?.name)
    }, [size])
    const updateProductSizeMutation = useMutation({
        mutationFn: (mutationPayload) => sizeApi.update(mutationPayload.id, mutationPayload.body),
        onSuccess: (data) => {
            navigate('/admin/size')
        }
    })

    const onSubmit = handleSubmit((data) => {
        updateProductSizeMutation.mutate({ id, body: data })
    })
    return (
        <Box>
            <TitleManager>Sửa size</TitleManager>
            <Box
                onSubmit={onSubmit}
                component='form'
                sx={{ backgroundColor: '#fff', pb: 8, py: 4, px: { xs: 1, md: 4 } }}
            >
                <Grid container>
                    <Grid item md={6} xs={12}>
                        <Box>
                            <Typography sx={{ fontSize: '15px', color: '#555555CC', mb: '5px' }} component='p'>
                                Tên size
                            </Typography>
                            <Input name='name' register={register} errors={errors} fullWidth size='small' />
                        </Box>
                    </Grid>
                </Grid>
                <Button type='submit' sx={{ mt: 2 }} variant='contained'>
                    Cập nhật size
                </Button>
            </Box>
        </Box>
    )
}
