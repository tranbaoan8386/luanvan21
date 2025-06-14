import React from "react";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import productApi from "../../../../apis/product";
import GridProduct from "../../../../components/GridProduct";
import ProductItem from "../../../../components/ProductItem/ProductItem";
import Pagination from "./modules/Panigation";
import SortProduct from "./modules/SortProduct";
import categoryApi from "../../../../apis/category";
import brandApi from "../../../../apis/brand";
import useQuertConfig from "../../../../hooks/useQuertConfig";
import Aside from "./modules/Aside";
import "./styles.scss";

const BASE_API_URL = "http://localhost:8000";

export default function ProductList() {
  const queryConfig = useQuertConfig();

  const { data: producstData } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => productApi.getAllProduct(queryConfig),
    keepPreviousData: true,
  });

  const pageSize = producstData?.data.pagination.page_size;

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAllCategory(),
  });
  const categories = categoriesData?.data || [];

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.getAllBrand(),
  });
  const brands = brandsData?.data || [];

  const productItems = producstData?.data.products?.map((product) => {
  const firstItem = product.productItems?.[0];

  const avatarPath = product.avatar
    ? product.avatar.startsWith("/uploads")
      ? product.avatar
      : `/uploads/${product.avatar}`
    : "/fallback.jpg";

  return {
    id: product.id ?? "",
    name: product.name ?? "Sản phẩm không tên",
    img: `${BASE_API_URL}${avatarPath}`,
    price: firstItem?.price ?? null,
    promotionPrice: null,
    rating: product.rating ?? 0,
    sold: product.productItems?.reduce((sum, pi) => sum + (pi.sold || 0), 0) ?? 0, // ✅ Sửa ở đây
    weight: product.weight ?? null,
  };
}) ?? [];


  return (
    <Grid alignItems="flex-start" container spacing={2}>
      <Grid
        sx={{ backgroundColor: "#F5F5F5", mt: 2, pb: 3, borderRadius: "8px" }}
        item
        md={12}
        lg={2.2}
      >
        <Typography
          mb={4}
          fontSize="18px"
          textTransform="uppercase"
          fontWeight="600"
          component="p"
        >
          Bộ lọc tìm kiếm
        </Typography>
        <div className="filter">
          <Aside queryConfig={queryConfig} categories={categories} brands={brands} />
        </div>
      </Grid>

      <Grid item md={12} lg={9.8}>
        <Box>
          <SortProduct queryConfig={queryConfig} />
          <GridProduct>
            {productItems.map((item) => (
              <ProductItem key={item.id} {...item} />
            ))}
          </GridProduct>
          <Pagination pageSize={pageSize} queryConfig={queryConfig} />
        </Box>
      </Grid>
    </Grid>
  );
}
