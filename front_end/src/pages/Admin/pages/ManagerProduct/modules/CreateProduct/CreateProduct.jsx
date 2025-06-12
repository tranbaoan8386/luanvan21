import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Input from "../../../../../../components/Input";
import TitleManager from "../../../../../../components/Admin/TitleManager";
import Editor from "../../../../../../components/Admin/Editor/Editor";
import categoryApi from "../../../../../../apis/category";
import brandApi from "../../../../../../apis/brand";
import colorApi from "../../../../../../apis/color";
import sizeApi from "../../../../../../apis/size";
import materialApi from "../../../../../../apis/material"; 
import productApi from "../../../../../../apis/product";
import { createProductSchema } from "../../../../../../validation/product";

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

export default function CreateProduct() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [colorImages, setColorImages] = useState({}); // 👉 Thêm state lưu nhiều ảnh theo từng màu
  const previewImage = useMemo(() => {
    return image ? URL.createObjectURL(image) : "";
  }, [image]);
  const [description, setDescription] = useState("");
  const [colorUnits, setColorUnits] = useState({});
  const [materialIds, setMaterialIds] = useState({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      productCouponId: "",
      colorId: [],
      categoryId: "",
      brandId: ""
    },
    resolver: yupResolver(createProductSchema)
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.getAllCategory
  });
  const categories = categoriesData?.data || [];
  const { data: sizesData } = useQuery({
    queryKey: ["sizes"],
    queryFn: sizeApi.getAllSize  // Replace with the actual API method to get sizes
  });
  
  const sizes = sizesData?.data || []; // If sizesData is undefined or null, default to an empty array
  
  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: brandApi.getAllBrand
  });
  const brands = brandsData?.data || [];

  const { data: colorsData } = useQuery({
    queryKey: ["colors"],
    queryFn: colorApi.getAllColor
  });
  const colors = colorsData?.data || [];

  const { data: materialsData } = useQuery({
    queryKey: ["materials"],
    queryFn: materialApi.getAllMaterial
  });
  const materials = materialsData?.data || []; // 👈 THÊM DÒNG NÀY
  


  const handleChangePhoto = (e) => {
    const fileFromLocal = e.target.files?.[0];
    if (fileFromLocal) {
      setImage(fileFromLocal);
    }
  };

  const handleColorUnitChange = (colorId, size, value) => {

    const numValue = parseInt(value);
    if (numValue < 0) {
        setError(`colorUnits[${colorId}][${size}]`, {
            type: "manual",
            message: "Số lượng tồn phải lớn hơn 0"
        });
    } else {
        clearErrors(`colorUnits[${colorId}][${size}]`);
        setColorUnits((prev) => ({
            ...prev,
            [colorId]: {
                ...prev[colorId],
                [size]: value
            }
        }));
    }
  };
  const handleMaterialChange = (colorId, materialId) => {
    setMaterialIds((prev) => ({
      ...prev,
      [colorId]: materialId
    }));
  };

  const handleColorImagesChange = (colorId, files) => {
    setColorImages((prev) => ({
      ...prev,
      [colorId]: Array.from(files) // đảm bảo là mảng File
    }));
  };
  

  const createProductMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      navigate("/admin/product");
    },
    onError: (error) => {
      if (error.response?.status === 500) {
        toast.error(error.response?.data.message);
      } else if (error.response?.status === 400) {
        const formError = error.response?.data.data;
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key, {
              type: "manual",
              message: formError[key]
            });
          });
        }
      }
      toast.error('Tên sản phẩm đã bị trùng')
    }
  });

  const handleEditorChange = (content) => {
    /* console.log("Nội dung editor:", content); */
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.innerText || tempDiv.textContent;
    setDescription(textContent.trim()); // thêm .trim() để loại bỏ khoảng trắng
  };
  

  const onSubmit = handleSubmit((data) => {
    // Kiểm tra giá có chia hết cho 1000 không
    if (data.price % 1000 !== 0) {
        setError("price", {
            type: "manual",
            message: "Giá sản phẩm phải là bội số của 1000"
        });
        return;
    }

    // Kiểm tra số lượng tồn của tất cả các màu và size
    const hasInvalidStock = Object.keys(colorUnits).some(colorId =>
        Object.values(colorUnits[colorId]).some(stock => {
            const numStock = parseInt(stock);
            return numStock < 0;
        })
    );

    if (hasInvalidStock) {
        toast.error("Số lượng tồn phải lớn hơn 0");
        return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("productCouponId", data.productCouponId);
    formData.append("description", description);
    formData.append("categoryId", data.categoryId);
    formData.append("brandId", data.brandId);
  
    // Thêm hình ảnh vào FormData (nếu có)
    formData.append("image", image); // 👉 ảnh avatar

    // 👇 gửi ảnh chi tiết theo từng màu
    Object.keys(colorImages).forEach((colorId) => {
      colorImages[colorId].forEach((file) => {
        formData.append(`colorImages_${colorId}[]`, file);
      });
    });
    
  
    

    // Chuyển đổi mảng colors thành đúng định dạng
    const colorsArray = data.colorId.map((colorId) => ({
      colorId,
      materialId: materialIds[colorId] || null,
      sizes: Object.keys(colorUnits[colorId] || {}).map((id) => {
        const unitInStock = parseInt(colorUnits[colorId][id], 10);
        return {
          id: parseInt(id, 10),
          unitInStock: isNaN(unitInStock) ? 0 : unitInStock
        };
      }),
      images: (colorImages[colorId] || []).map((file) => file.name) // 👈 dùng tên file thật
    }));

    
    // Kiểm tra để đảm bảo không có giá trị null hoặc undefined trong unitInStock
    if (colorsArray.some(color => color.sizes.some(size => size.unitInStock === null || size.unitInStock === undefined))) {
      toast.error("Số lượng tồn kho không thể để trống hoặc là null");
      return;
    }
  
    // Chuyển đổi mảng colors thành JSON và thêm vào FormData
    formData.append("colors", JSON.stringify(colorsArray));
  
    // 👉 Thêm đoạn log tại đây để debug
    console.log("📦 FormData gửi:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // Gửi FormData tới API
    createProductMutation.mutate(formData);
  });
  
  
  
  

  return (
    <Box>
      <TitleManager>Thêm sản phẩm</TitleManager>
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
                    value={colorUnits[color.id]?.[size.id] || ""}
                    onChange={(e) => handleColorUnitChange(color.id, size.id, e.target.value)}
                    disabled={!field.value.includes(color.id)}
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
              <Editor onContentChange={handleEditorChange} />
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
          Thêm sản phẩm
        </Button>        
      </Box>
    </Box>
  );
}
