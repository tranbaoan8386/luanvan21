import React, { Fragment } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { BiCategory } from "react-icons/bi";
import { TbBrand4Chan } from "react-icons/tb";
import { omit } from "lodash";
import AsideItem from "../../../../../../components/AsideItem/AsideItem";
import LineAside from "../../../../../../components/LineAside/LineAside";
import FilterPriceRange from "../FilterPriceRange";
import MyButton from "../../../../../../components/MyButton";
export default function AsideCategory({ queryConfig, categories, brands, colors}) {
  // queryConfig vì nếu đang sort bán chạy mà chọn danh mục và thương hiệu thì phải lọc theo danh mục và thương hiệu đó và bán chạy
  const navigate = useNavigate();
  const handleRemoveFilterAll = () => {
    navigate({
      pathname: "/",
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ["price_min", "price_max", "category", "brand", "color"]
        )
      ).toString()
    });
  };

  return (
    <Fragment>
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

      <MyButton
        onClick={handleRemoveFilterAll}
        mt="8px"
        height="35px"
        width="100%"
      >
        Xóa tất cả
      </MyButton>
    </Fragment>
  );
}
