import React, { useEffect, useState } from 'react';
import productApi from "../../../../../../apis/product";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import { toast } from "react-toastify";
import { BASE_URL_IMAGE } from "../../../../../../constants";

export default function DeletedProduct() {
  const [deletedProducts, setDeletedProducts] = useState([]);

  const fetchDeletedProducts = async () => {
    try {
      const res = await productApi.getDeletedProducts();
      setDeletedProducts(res.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách sản phẩm đã xóa:', error);
      toast.error("Không thể tải danh sách sản phẩm đã xóa");
    }
  };

  const handleRestore = async (id) => {
    try {
      await productApi.restoreProduct(id);
      toast.success("Khôi phục thành công");
      fetchDeletedProducts();
    } catch (error) {
      console.error('Khôi phục thất bại:', error);
      toast.error("Khôi phục thất bại");
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Danh sách sản phẩm đã xóa
      </Typography>

      {deletedProducts.length === 0 ? (
        <Typography>Không có sản phẩm nào đã xóa.</Typography>
      ) : (
        <Grid container spacing={3}>
          {deletedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    product.avatar
                      ? `${BASE_URL_IMAGE}/${product.avatar}`
                      : "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2">
                    Danh mục: {product.category?.name || "Không rõ"}
                  </Typography>
                  <Typography variant="body2">
                    Thương hiệu: {product.brand?.name || "Không rõ"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRestore(product.id)}
                  >
                    Khôi phục
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
