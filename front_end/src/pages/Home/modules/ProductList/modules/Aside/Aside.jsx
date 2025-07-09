import React, { Fragment } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { TbBrand4Chan } from "react-icons/tb";
import { omit } from "lodash";
import AsideItem from "../../../../../../components/AsideItem/AsideItem";
import LineAside from "../../../../../../components/LineAside/LineAside";
import FilterPriceRange from "../FilterPriceRange";
import MyButton from "../../../../../../components/MyButton";
import { Box, Paper, Typography } from "@mui/material";

export default function AsideCategory({ queryConfig, categories, brands, colors }) {
  const navigate = useNavigate();

  const handleRemoveFilterAll = () => {
    navigate({
      pathname: "/",
      search: createSearchParams(
        omit({ ...queryConfig }, ["price_min", "price_max", "category", "brand", "color"])
      ).toString()
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: "#fff" }}>
      <Typography
        variant="h6"
        fontWeight={600}
        textTransform="uppercase"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <BiCategory style={{ marginRight: 8 }} />
        Bộ lọc tìm kiếm
      </Typography>

      <AsideItem
        data={categories}
        queryConfig={queryConfig}
        title="Danh mục"
        icon={<BiCategory />}
        filterBy="category"
      />
      <LineAside />

      <AsideItem
        data={brands}
        queryConfig={queryConfig}
        title="Thương hiệu"
        icon={<TbBrand4Chan />}
        filterBy="brand"
      />
      <LineAside />

      <FilterPriceRange queryConfig={queryConfig} />

      <Box mt={2}>
        <MyButton
          onClick={handleRemoveFilterAll}
          mt="8px"
          height="35px"
          width="100%"
        >
          Xóa tất cả
        </MyButton>
      </Box>
    </Paper>
  );
}
