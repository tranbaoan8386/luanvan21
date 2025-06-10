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
import materialApi from "../../../../../../apis/material"; 
import { BASE_URL_IMAGE } from "../../../../../../constants/index";
import sizeApi from "../../../../../../apis/size";
import { toast } from "react-toastify";

export default function UpdateProduct() {
  const navigate = useNavigate();
  // State lưu ảnh đại diện sản phẩm
  const [image, setImage] = useState(null);
  // Tạo preview ảnh từ file hoặc URL
  const previewImage = useMemo(() => {
    if (image instanceof Blob) {
      return URL.createObjectURL(image);
    } else if (typeof image === "string" && image) {
      return image;
    } else {
      return "";
    }
  }, [image]);
  // Mô tả sản phẩm dạng text (từ editor)
  const [description, setDescription] = useState("");
  // Quản lý số lượng tồn kho theo màu - size
  const [colorUnits, setColorUnits] = useState({});
  // Lưu chất liệu theo từng màu
  const [materialIds, setMaterialIds] = useState({});
   // Lưu ảnh chi tiết theo từng màu
  const [colorImages, setColorImages] = useState({});

  // Khởi tạo form với useForm
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    watch,
    setValue,
    reset,
    formState: { errors }
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
  // Input ẩn để chọn file ảnh đại diện
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

  // Gọi API lấy danh sách danh mục, thương hiệu, màu, size, chất liệu
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
    
  // Get colors
  const { data: colorData } = useQuery({
    queryKey: ["colors"],
    queryFn: () => colorApi.getAllColor()
  });
  const colors = colorData?.data || [];
  // Get sz
  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: sizeApi.getAllSize
  });
  const sizes = sizesData?.data || [];
  //get material
  const { data: materialsData } = useQuery({
    queryKey: ["materials"],
    queryFn: materialApi.getAllMaterial
  });
  const materials = materialsData?.data || [];

  // Lấy id sản phẩm từ URL
  const { id } = useParams();
  // Lấy thông tin chi tiết sản phẩm từ server
  const { data: productData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getDetailProduct(id),
    enabled: true
  });
  const product = productData?.data?.product; 
  
  // Khi có dữ liệu sản phẩm, reset form và state
  useEffect(() => {
    if (product) {
      console.log("product:", product);
  
      const initialColorUnits = {};
      const initialMaterialIds = {};
      const initialColorImages = {};
      const selectedColorIdsSet = new Set();
  
      product.productItems.forEach(item => {
        const colorId = item.color.id;
        const sizeId = item.size.id;
        const materialId = item.material?.id;
        const unitInStock = item.unitInStock || 0;
        const imageUrls = item.images?.map(img => img.url) || [];
  
        selectedColorIdsSet.add(colorId);
  
        // Số lượng tồn theo size
        if (!initialColorUnits[colorId]) initialColorUnits[colorId] = {};
        initialColorUnits[colorId][sizeId] = unitInStock;
  
        // Chất liệu
        if (!initialMaterialIds[colorId]) initialMaterialIds[colorId] = materialId;
  
        // Ảnh
        if (!initialColorImages[colorId]) initialColorImages[colorId] = [];
        imageUrls.forEach(url => {
          if (!initialColorImages[colorId].some(img => img.name === url)) {
            initialColorImages[colorId].push({
              name: url,
              isOld: true,
              preview: `${BASE_URL_IMAGE}/${url}`
            });
          }
        });
      });
      console.log("initialColorUnits", initialColorUnits);

      reset({
        name: product.name,
        price: product.productItems?.[0]?.price || 0,
        productCouponId: product.coupon?.id || null,
        categoryId: product.categories_id,
        brandId: product.brands_id,
        colorId: Array.from(selectedColorIdsSet),
        description: product.description
      });
      
  
      setValue("colorId", Array.from(selectedColorIdsSet));
      setMaterialIds(initialMaterialIds);
      setColorUnits(initialColorUnits);
      setColorImages(initialColorImages);
      setDescription(product.description);
      setImage(product.avatar ? `${BASE_URL_IMAGE}/${product.avatar}` : null);
    }
    
  }, [product]);
  
  
  
  


  // Hàm xử lý thay đổi ảnh đại diện
  const handleChangePhoto = (e) => {
    const fileFromLocal = e.target.files?.[0];
    setImage(fileFromLocal);
  };
  // Hàm xử lý thay đổi số lượng theo size và màu
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
  // Xử lý thay đổi material theo màu
  const handleMaterialChange = (colorId, materialId) => {
    setMaterialIds(prev => ({
      ...prev,
      [colorId]: materialId
    }));
  };
  // Xử lý upload ảnh mới theo từng màu
  const handleColorImagesChange = (colorId, files) => {
    const newFiles = Array.from(files).map(file => ({ file, isOld: false }));
    setColorImages(prev => ({
      ...prev,
      [colorId]: [...(prev[colorId] || []).filter(img => img.isOld), ...newFiles]
    }));
  };
  // Theo dõi danh sách màu được chọn
  const selectedColors = watch("colorId");
  // Xử lý thay đổi nội dung mô tả từ editor
  const handleEditorChange = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.innerText || tempDiv.textContent;
    setDescription(textContent);
  };
    // Gọi API cập nhật sản phẩm
  const updateProductMutation = useMutation({
    mutationFn: (mutationPayload) =>
      productApi.updateProduct(mutationPayload.id, mutationPayload.body),
    onSuccess: () => {
      navigate("/admin/product");
    }, onError: () => {
      toast.error('Lỗi khi cập nhật sản phẩm')
    }
  });

   // Xử lý khi submit form
  const onSubmit = handleSubmit((data) => {
    if (data.price % 1000 !== 0) {
      setError("price", {
        type: "manual",
        message: "Giá sản phẩm phải là bội số của 1000"
      });
      return;
    }

    const hasInvalidStock = Object.keys(colorUnits).some(colorId =>
      Object.values(colorUnits[colorId]).some(stock => parseInt(stock) < 0)
    );
    if (hasInvalidStock) {
      toast.error("Số lượng tồn phải lớn hơn 0");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("productCouponId", data.productCouponId);
    formData.append("description", description);
    formData.append("categoryId", data.categoryId);
    formData.append("brandId", data.brandId);

    if (image && image instanceof Blob) {
      formData.append("image", image);
    }

    Object.keys(colorImages).forEach((colorId) => {
      colorImages[colorId].forEach((imgObj) => {
        if (!imgObj.isOld) {
          formData.append(`colorImages_${colorId}[]`, imgObj.file);
        }
      });
    });

    const colorsArray = data.colorId.map((colorId) => ({
      colorId,
      materialId: materialIds[colorId] || null,
      sizes: Object.keys(colorUnits[colorId] || {}).map(sizeId => ({
        id: parseInt(sizeId),
        unitInStock: parseInt(colorUnits[colorId][sizeId]) || 0
      })),
      images: (colorImages[colorId] || []).map(imgObj =>
        imgObj.isOld ? imgObj.name : imgObj.file.name
      )
    }));

    formData.append("colors", JSON.stringify(colorsArray));
    updateProductMutation.mutate({ id, body: formData });
  });

  
  return (
    <Box>
      <TitleManager>Sửa sản phẩm</TitleManager>
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
        flexDirection: "column", // 👉 Cho gọn gàng
        mb: 2,
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd"
      }}
    >
      <Controller
        name="colorId"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                  width: "30px",
                  height: "26px",
                  marginLeft: "10px",
                  borderRadius: "50%",
                  border: "1px solid #ddd",
                  backgroundColor: color.colorCode,
                  padding: "5px"
                }}
              />
            </Box>

            {/* 👇 Chọn chất liệu cho từng màu */}
            <FormControl
              size="small"
              sx={{ minWidth: 160, ml: 2, mb: 2 }}
              disabled={!field.value.includes(color.id)}
            >
              <Select
                displayEmpty
                value={materialIds[color.id] || ""}
                onChange={(e) => handleMaterialChange(color.id, e.target.value)}
              >
                <MenuItem value="">Chọn chất liệu</MenuItem>
                {materials.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ✅ Thêm chọn ảnh chi tiết tại đây */}
            <Box sx={{ ml: 2, mb: 2 }}>
              <Typography variant="caption">Chọn ảnh chi tiết cho màu {color.name}</Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleColorImagesChange(color.id, e.target.files)}
                disabled={!field.value.includes(color.id)}
              />
            </Box>

            {/* 👇 Số lượng theo size */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {sizes.map((size) => (
                <Box key={size.id} sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "14px", mr: 1 }}>{size.name}</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={colorUnits[color.id]?.[size.id] ?? ""}
                    onChange={(e) => handleColorUnitChange(color.id, size.id, e.target.value)}
                    error={Boolean(errors.colorUnits?.[color.id]?.[size.id]?.message)}
                    helperText={errors.colorUnits?.[color.id]?.[size.id]?.message}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}
      />
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
                defaultValue={[]}
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
                defaultValue={[]}
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
                initialContent={description}
                onContentChange={handleEditorChange}
              />

            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Xem trước mô tả
              </Typography>
              <Box>{description}</Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "15px", color: "#555555CC", mb: "5px" }}
                component="p"
              >
                Hình ảnh Avatar
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
          Sửa sản phẩm
        </Button>        
      </Box>
    </Box>
  );
}
