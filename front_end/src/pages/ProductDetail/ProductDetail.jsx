import { Box, Container, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import cartApi from '../../apis/cart';
import productApi from '../../apis/product';

import { formatCurrency, getIdFormNameId } from '../../common';
import Breadcrumb from '../../components/Breadcrumb';
import MyButton from '../../components/MyButton';
import Tabs from './modules/Tabs';
import './styles.scss';
import { queryClient } from '../../main';
import { AppContext } from '../../contexts/App';
import { Button } from '@mui/base';

export default function ProductDetail() {
    const { nameId } = useParams();
    const id = getIdFormNameId(nameId);
    const { isAuthenticated } = useContext(AppContext);
    const navigate = useNavigate();
    const { data: productData } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductDetal(id)
    });

    const [quantity, setQuantity] = useState(1);
    const [currentIndexImage, setCurrentIndexImage] = useState([0, 5]);
    const [activeImage, setActiveImage] = useState('');
    const [selectedColorId, setSelectedColorId] = useState(null);

    const product = productData?.data.product;

    const images = product?.images || [];
    console.log(images);

    const imageRef = useRef(null);
    const currentImages = useMemo(() => images.slice(...currentIndexImage), [productData, currentIndexImage]);

    useEffect(() => {
        if (productData && images.length > 0) {
            setActiveImage(images[0]);
        }
    }, [productData]);

    const chooseActiveImage = (img) => {
        setActiveImage(img);
    };
    const [carts, setCarts] = useState([]);


    const next = () => {
        if (currentIndexImage[1] < images.length) {
            setCurrentIndexImage((prev) => [prev[0] + 1, prev[1] + 1]);
        }
    };

    const prev = () => {
        if (currentIndexImage[0] > 0) {
            setCurrentIndexImage((prev) => [prev[0] - 1, prev[1] - 1]);
        }
    };

    const handleZoom = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const image = imageRef.current;
        const { naturalHeight, naturalWidth } = image;
        const { offsetX, offsetY } = e.nativeEvent;
        const top = offsetY * (1 - naturalHeight / rect.height);
        const left = offsetX * (1 - naturalWidth / rect.width);
        image.style.width = naturalHeight + 'px';
        image.style.height = naturalWidth + 'px';
        image.style.top = top + 'px';
        image.style.left = left + 'px';
    };

    const handleRemoveZoom = () => {
        imageRef.current.removeAttribute('style');
    };

    const addToCartMutation = useMutation({
        mutationFn: (body) => cartApi.addToCart(body)
    });


    const handleColorClick = (colorId) => {
        setSelectedColorId(colorId);
    };
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        addToCartMutation.mutate(
            { productId: product.id, colorId: selectedColorId, quantity: quantity },
            {
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: ['carts'] })
                }
            }
        )
    }

    const getStockQuantity = (colorId) => {
        const productItem = product.productItems.find(item => item.colorId === colorId);
        return productItem ? productItem.unitlnStock : 0;
    };

    if (!product) return null;

    return (
        <Container sx={{ mt: 2 }}>
            <Breadcrumb page='Chi tiết' title={product.name} />
            <Box sx={{ mt: 2, background: '#fff', borderRadius: '5px', p: 3 }}>
                <Grid direction='row' justifyContent='center' alignItems='center' container spacing={5}>
                    <Grid item md={5} xs={12}>
                        <div onMouseMove={handleZoom} onMouseLeave={handleRemoveZoom} className='detail-img'>
                            <img ref={imageRef} srcSet={activeImage.url} alt='' />
                        </div>
                        <div className='product-image'>
                            <button onClick={prev} className='image-prev'>
                                <MdNavigateBefore fontSize='25px' />
                            </button>
                            {currentImages &&
                                currentImages.map((img, index) => (
                                    <div onMouseEnter={() => chooseActiveImage(img)} key={index} className='image-wrap'>
                                        <img width='82px' height='82px' src={img.url} alt={img.url} />
                                        {activeImage === img && <div className='is-active'></div>}
                                    </div>
                                ))}
                            <button onClick={next} className='image-next'>
                                <MdNavigateNext fontSize='25px' />
                            </button>
                        </div>
                    </Grid>

                    <Grid item md={7} xs={12}>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: '23px',
                                    color: '#000000CC',
                                    mb: 2,
                                    lineHeight: 1.5,
                                    letterSpacing: '0.02em'
                                }}
                            >
                                {product.name}
                            </Typography>

                            <Typography display='flex'>

                                <Typography>
                                    {product.description}
                                </Typography>
                            </Typography>

                            <Box sx={{ p: 1, backgroundColor: '#FAFAFA', borderRadius: '10px', marginTop: '10px', }}>
                                {product.productCounponId && (
                                    <Typography
                                        sx={{
                                            fontSize: '28px', // Correct syntax without duplicate keys
                                            color: '#D70018',
                                            fontWeight: '500',
                                            height: '65px',

                                        }}
                                        variant='span'
                                    >
                                        {formatCurrency(product.productCounponId)}đ
                                    </Typography>
                                )}

                                <Typography
                                    sx={{
                                        textDecoration: !product.productCounponId ? 'none' : 'line-through',
                                        fontSize: !product.productCounponId ? '28px' : '18px',
                                        ml: 1,
                                        color: '#707070',
                                        marginTop: '40px',
                                        fontWeight: '500',
                                        height: '65px'
                                    }}
                                    variant='span'
                                >
                                    {formatCurrency(product.price)}đ
                                </Typography>
                            </Box>

                            <Divider sx={{ mt: 2 }} component='p' />
                            <Typography display='flex' color='gray' mt={2}>
                                <Typography color='#757575' component='span' display='flex' fontWeight='500' mt={0.5}>
                                    Danh Mục:
                                    <Typography ml={1} component='span' fontWeight='500' color='#000'>
                                        {product.category.name}
                                    </Typography>
                                </Typography>
                            </Typography>

                            <Typography color='#757575' display='flex' component='span' fontWeight='500' mt={0.5}>
                                Màu:
                                {product.colorProducts.map((item, index) => (
                                    <Button key={item.id} className='buttons' onClick={() => handleColorClick(item.id)}>
                                        <Typography color='black'>
                                            {item.name}
                                        </Typography>
                                    </Button>
                                ))}
                            </Typography>

                            {selectedColorId !== null && (
                                <Typography mt={2}>
                                    Số lượng tồn kho là: {getStockQuantity(selectedColorId)}
                                </Typography>
                            )}

                            <Typography mt={4} component='p'>
                                Số lượng
                            </Typography>
                            <Box>
                                <TextField
                                    inputProps={{ min: 1 }}
                                    defaultValue={1}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    sx={{ width: '150px' }}
                                    size='small'
                                    type='number'
                                />
                            </Box>
                            <MyButton onClick={handleAddToCart} fontSize='14px' mt='30px' width='200px' height='45px'>
                                <FaCartPlus fontSize='18px' />
                                Thêm vào giỏ hàng
                            </MyButton>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    mb: 2,
                    p: 3,
                    borderRadius: '5px',
                    background: '#fff'
                }}
            >
                <Tabs product={product} />
            </Box>
        </Container>
    );
}
