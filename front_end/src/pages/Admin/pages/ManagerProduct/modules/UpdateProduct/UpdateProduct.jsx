import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography,
 
 
  TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../../../../../apis/product";
import Editor from "../../../../../../components/Admin/Editor/Editor";
import TitleManager from "../../../../../../components/Admin/TitleManager";
import Input from "../../../../../../components/Input";
import categoryApi from "../../../../../../apis/category";
import brandApi from "../../../../../../apis/brand";
import colorApi from "../../../../../../apis/color";
import { BASE_URL_IMAGE } from "../../../../../../constants/index";
import sizeApi from "../../../../../../apis/size";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const previewImage = useMemo(() => {
    if (image instanceof Blob) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string" && image) {
      return image;
    } else {
      return "";
    }
  }, [image]);
  const [description, setDescription] = useState("");
  const [colorUnits, setColorUnits] = useState({});
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      productCouponId: "",
      colorId: [],
      categoryId: "",
      brandId: "",
      description: ""
    }
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1
  });

  // Get categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAllCategory()
  });
  const categories = categoriesData?.data || [];

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.getAllBrand
  });
  const brands = brandsData?.data || [];
 
  const ColorAndSizeSelection = ({ colors, sizes, control, colorUnits, handleColorUnitChange }) => {
    
  
  };
  
  
  // Get colors
  const { data: colorData } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorApi.getAllColor()
  });
  const colors = colorData?.data || [];

  const { id } = useParams();

  const { data: productData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getDetailProduct(id),
    enabled: true
  });
  const product = productData?.data?.product;
  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: sizeApi.getAllSize  // Replace with the actual API method to get sizes
  });
  
  const sizes = sizesData?.data || []; // If sizesData is undefined or null, default to an empty array
  
  const handleChangePhoto = (e) => {
    const fileFromLocal = e.target.files?.[0];
    setImage(fileFromLocal);
  };
  const handleColorUnitChange = (colorId, sizeId, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) {
      setError(`colorUnits[${colorId}][${sizeId}]`, {
        type: "manual",
        message: "Số lượng tồn không được nhỏ hơn 0"
      });
    } else if (numValue > 100) {
      setError(`colorUnits[${colorId}][${sizeId}]`, {
        type: "manual",
        message: "Số lượng tồn không được lớn hơn 100"
      });
    } else {
      clearErrors(`colorUnits[${colorId}][${sizeId}]`);
      setColorUnits((prev) => ({
        ...prev,
        [colorId]: {
          ...prev[colorId],
          [sizeId]: value
        }
      }));
    }
  };

  useEffect(() => {
    if (product) {
      console.log("Product data:", product); // Để debug

      // Khởi tạo colorUnits từ dữ liệu colors của sản phẩm
      const initialColorUnits = {};
      product.colors?.forEach(color => {
        initialColorUnits[color.id] = {};
        color.sizes?.forEach(size => {
          initialColorUnits[color.id][size.sizeId] = size.stock;
        });
      });

      // Set giá trị cho form
      reset({
        name: product.name,
        price: product.price,
        productCouponId: product.productCouponId,
        categoryId: product.categoryId,
        brandId: product.brandId,
        colorId: product.colors?.map(color => color.id) || [],
        description: product.description
      });

      setColorUnits(initialColorUnits);
      setDescription(product.description);
      setImage(product.image ? `${BASE_URL_IMAGE}/${product.image}` : null);
    }
  }, [product, reset]);

  

  const updateProductMutation = useMutation({
    mutationFn: (mutationPayload) =>
      productApi.updateProduct(mutationPayload.id, mutationPayload.body),
    onSuccess: () => {
      navigate("/admin/product");
    }, onError: () => {
      toast.error('Lỗi khi cập nhật sản phẩm')
    }
  });

  const onSubmit = handleSubmit((data) => {
    // Kiểm tra giá có chia hết cho 1000 không
    if (data.price % 1000 !== 0) {
      setError("price", {
        type: "manual",
        message: "Giá sản phẩm phải là bội số của 1000"
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("productCouponId", data.productCouponId);
    formData.append("description", description);
    formData.append("categoryId", data.categoryId);
    formData.append("brandId", data.brandId);

    // Chuyển đổi dữ liệu màu và size theo đúng format
    const colorsArray = data.colorId.map((colorId) => ({
      colorId,
      sizes: Object.keys(colorUnits[colorId] || {}).map((sizeId) => ({
        id: parseInt(sizeId, 10),
        unitlnStock: parseInt(colorUnits[colorId][sizeId], 10) || 0
      }))
    }));

    formData.append("colors", JSON.stringify(colorsArray));

    if (image && image instanceof Blob) {
      formData.append("image", image);
    }

    updateProductMutation.mutate({ id, body: formData });
  });

  // Watch colorId field to dynamically enable/disable unitlnStock inputs
  const selectedColors = watch("colorId");

  const handleEditorChange = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.innerText || tempDiv.textContent;
    setDescription(textContent);
  };

  return (
    <Box>
      <TitleManager>Cập nhật sản phẩm</TitleManager>
      <Box
        onSubmit={onSubmit}
        component="form"
        sx={{ backgroundColor: "#fff", pb: 8, px: { xs: 1, md: 4 } }}
      >
        <Grid container spacing={5}>
          <Grid item md={6} xs={12}>
            <Box>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Tên sản phẩm
              </Typography>
              <Input
                name="name"
                register={register}
                errors={errors}
                fullWidth
                size="small"
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }} component="p">
                Màu sắc & Số lượng tồn
              </Typography>
        
              {colors.map((color) => (
                <Box
                  key={color.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    padding: "5px",
                    borderRadius: "5px",
                    backgroundColor: watch("colorId").includes(color.id) ? "#f5f5f5" : "transparent"
                  }}
                >
                  <Controller
                    name="colorId"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <>
                        <input
                          style={{ marginLeft: "10px" }}
                          type="checkbox"
                          value={color.id}
                          onChange={(e) => {
                            const selectedColors = e.target.checked
                              ? [...field.value, color.id]
                              : field.value.filter((id) => id !== color.id);
                            field.onChange(selectedColors);
                          }}
                          checked={field.value.includes(color.id)}
                        />
                        <Box
                          sx={{
                            mb: 1,
                            width: "30px",
                            height: "26px",
                            marginLeft: "10px",
                            borderRadius: "50%",
                            border: "1px solid #ddd",
                            backgroundColor: color.colorCode,
                            padding: "5px"
                          }}
                        />
                      </>
                    )}
                  />
        
                  {sizes.map((size) => (
                    <Box key={size.id} sx={{ ml: 2, display: "flex", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "14px", mr: 1 }}>
                        {size.name}
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        sx={{ width: "80px" }}
                        value={colorUnits[color.id]?.[size.id] || ""}
                        onChange={(e) => handleColorUnitChange(color.id, size.id, e.target.value)}
                        disabled={!watch("colorId").includes(color.id)}
                        error={Boolean(errors.colorUnits?.[color.id]?.[size.id])}
                        helperText={errors.colorUnits?.[color.id]?.[size.id]?.message}
                        // inputProps={{
                        //   min: 0,
                        //   max: 100
                        // }}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Giá tiền (VND)
              </Typography>
              <Input
                type="number"
                name="price"
                register={register}
                errors={errors}
                fullWidth
                size="small"
                inputProps={{ 
                  step: "1000",
                  min: "0"
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Mã khuyến mãi
              </Typography>
              <Input
                type="number"
                name="productCouponId"
                register={register}
                errors={errors}
                fullWidth
                size="small"
              />
            </Box>
            
          </Grid>
          <Grid item md={6} xs={12}>
            <FormControl fullWidth>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Danh mục
              </Typography>

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    error={Boolean(errors.categoryId?.message)}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error={!!errors.categoryId?.message}>
                {errors.categoryId?.message}
              </FormHelperText>
            </FormControl>
            
            <FormControl fullWidth>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Thương hiệu
              </Typography>
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="small"
                    error={Boolean(errors.brandId?.message)}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                  >
                    {brands.map((brand) => (
                      <MenuItem value={brand.id} key={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              
              <FormHelperText error={!!errors.brandId?.message}>
                {errors.brandId?.message}
              </FormHelperText>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Mô tả sản phẩm
              </Typography>
              <Editor
                onContentChange={handleEditorChange}
                initialContent={description}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Hình ảnh
              </Typography>
              <Button
                sx={{ width: "200px", py: 1 }}
                component="label"
                variant="outlined"
                color="success"
                startIcon={<CloudUploadIcon />}
              >
                Chọn file
                <VisuallyHiddenInput
                  onChange={handleChangePhoto}
                  accept="image/*"
                  type="file"
                />
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              {previewImage && (
                <img
                  style={{ borderRadius: "5px" }}
                  width="200"
                  src={previewImage}
                  alt="product-image"
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Button
          type="submit"
          sx={{ width: "200px", mt: 2 }}
          variant="contained"
        >
          Cập nhật sản phẩm
        </Button>
      </Box>
    </Box>
  );
}
