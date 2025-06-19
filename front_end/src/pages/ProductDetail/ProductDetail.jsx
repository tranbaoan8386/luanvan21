import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Container,
  Divider,
  TextField,
  Typography,
  Alert,
  Button,
  Grid,
  Rating,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaCartPlus } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import cartApi from "../../apis/cart";
import reviewApi from "../../apis/review";
import { BASE_URL_IMAGE } from "../../constants";
import productApi from "../../apis/product";
import { formatCurrency, getIdFormNameId } from "../../common";
import Breadcrumb from "../../components/Breadcrumb";
import MyButton from "../../components/MyButton";
import Tabs from "./modules/Tabs";
import "./styles.scss";
import { queryClient } from "../../main";
import { AppContext } from "../../contexts/App";
import { toast } from "react-toastify";
import { borderBottom, padding } from "@mui/system";

export default function ProductDetail() {
  const { nameId } = useParams();
  const id = getIdFormNameId(nameId);
  const { isAuthenticated, profile: user } = useContext(AppContext);

  const navigate = useNavigate();

  const { data: productData } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getDetailProduct(id),
  });

  // const { data: productDa } = useQuery({
  //   queryKey: ["products", id],
  //   queryFn: () => productApi.getProductWithImages(id)
  // });

  const [quantity, setQuantity] = useState(1);
  const [currentIndexImage, setCurrentIndexImage] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState("");
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reply, setReply] = useState({});
  const [replySuccess, setReplySuccess] = useState("");
  const [replyError, setReplyError] = useState("");
  const [successReplyId, setSuccessReplyId] = useState(null);
  const { data: reviewData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewApi.getAllReviewProduct(id),
  });
  const reviews = reviewData?.data || [];

  const product = productData?.data.product;

  const colors = useMemo(() => {
    if (!product?.productItems) return [];
    const colorMap = {};

    product.productItems.forEach((item) => {
      const colorId = item.color?.id;
      const sizeId = item.size?.id;
      if (!colorId || !sizeId) return;

      if (!colorMap[colorId]) {
        colorMap[colorId] = {
          id: colorId,
          name: item.color.name,
          colorCode: item.color.colorCode,
          sizes: [],
        };
      }

      colorMap[colorId].sizes.push({
        sizeId,
        sizeName: item.size.name,
        stock: item.unitInStock,
        productItemId: item.id,
      });
    });

    return Object.values(colorMap);
  }, [product]);

  const images = useMemo(() => product?.images || [], [product?.images]);

  // const images = useMemo(
  //   () => productDa?.data?.images || [],
  //   [productDa?.data?.images]
  // );

  const image = useMemo(
    () => (product?.avatar ? [product.avatar] : []),
    [product?.avatar]
  );

  const imageRef = useRef(null);

  const currentImages = useMemo(
    () => images.slice(...currentIndexImage),
    [images, currentIndexImage]
  );

  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    } else if (image.length > 0) {
      setActiveImage(image[0]);
    }
  }, [images, image]);

  const chooseActiveImage = (img) => {
    setActiveImage(img);
  };

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

  const handleMouseEnter = () => {
    if (imageRef.current) {
      imageRef.current.classList.add("zoom");
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.classList.remove("zoom");
      handleRemoveZoom();
    }
  };

  const handleZoom = (e) => {
    const image = imageRef.current;
    if (!image) return;

    const rect = image.getBoundingClientRect(); // 👈 sửa lại cho đúng
    const { naturalHeight, naturalWidth } = image;
    const { offsetX, offsetY } = e.nativeEvent;

    const top = offsetY * (1 - naturalHeight / rect.height);
    const left = offsetX * (1 - naturalWidth / rect.width);

    image.style.transform = `scale(2) translate(${left / 2}px, ${top / 2}px)`;
    image.style.transformOrigin = "top left";
  };

  const handleRemoveZoom = () => {
    imageRef.current.removeAttribute("style");
  };

  const addToCartMutation = useMutation({
    mutationFn: (body) => cartApi.addToCart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      setError("");
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    },
  });

  const handleColorClick = (colorId) => {
    setSelectedColorId(colorId);
    setSelectedSizeId(null); // Reset size selection when color changes
  };
  const handleSizeClick = (sizeId) => {
    setSelectedSizeId(sizeId);
  };
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    console.log("Selected Color ID:", selectedColorId);
    console.log("Selected Size ID:", selectedSizeId);
    console.log("Products Detail:", product.productsDetail);

    if (!selectedColorId || !selectedSizeId) {
      alert("Vui lòng chọn màu và kích thước sản phẩm.");
      return;
    }

    const selectedColor = colors.find((color) => color.id === selectedColorId);
    // Tìm productItem dựa trên colorId
    const productItem = selectedColor?.sizes.find(
      (size) => size.sizeId === selectedSizeId
    );

    if (!productItem) {
      alert("Không tìm thấy sản phẩm với màu đã chọn.");
      return;
    }

    // Kiểm tra tồn kho

    const selectedSize = selectedColor?.sizes.find(
      (size) => size.sizeId === selectedSizeId
    );

    if (!selectedSize || selectedSize.stock <= 0) {
      alert("Sản phẩm này đã hết hàng.");
      return;
    }

    // Gọi API thêm vào giỏ hàng với productItem.id và size được chọn
    addToCartMutation.mutate(
      {
        products_item_id: productItem.productItemId, // ✅ đúng tên backend
        quantity,
        color_id: selectedColorId,
        size_id: selectedSizeId,
      },
      {
        onSuccess: (data) => {
          console.log("Thêm vào giỏ hàng thành công:", data);
          toast.success(`Đã thêm sản phẩm vào giỏ hàng!`);
          queryClient.invalidateQueries({ queryKey: ["carts"] });
        },
        onError: (error) => {
          console.error(
            "Thêm vào giỏ hàng thất bại:",
            error.response?.data?.message
          );
          toast.error(
            error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
          );
        },
      }
    );
  };

  const getStockQuantity = (colorId, sizeId) => {
    const selectedColor = colors.find((color) => color.id === colorId);

    const selectedSize = selectedColor?.sizes.find(
      (size) => size.sizeId === sizeId
    );
    return selectedSize?.stock || 0;
  };

  const createReviewMutation = useMutation({
    mutationFn: (newReview) => reviewApi.createReview(newReview),
    onSuccess: (data) => {
      toast.success("Đánh giá sản phẩm thành công");
      setComment("");
      setRating(0);
      queryClient.invalidateQueries("reviews");
    },
    onError: (error) => {
      // Hiển thị thông báo lỗi từ server
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đánh giá";
      toast.error(errorMessage);
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: (newReply) =>
      reviewApi.createReply(newReply.reviewId, newReply),
    onSuccess: (data, variables) => {
      setReplySuccess("Phản hồi của bạn đã được gửi thành công!");
      setReplyError("");
      setReply({});
      setSuccessReplyId(variables.reviewId); // Đặt trạng thái với ID của bình luận được phản hồi thành công
      queryClient.invalidateQueries("reviews");
    },
    onError: (error) => {
      setReplyError("Có lỗi xảy ra. Vui lòng thử lại!");
      setReplySuccess("");
    },
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      navigate("/login");
      return;
    }

    if (!rating) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    const newReview = {
      comment,
      rating,
      productId: product.id,
    };

    createReviewMutation.mutate(newReview);
  };

  const handleReplySubmit = (e, reviewId) => {
    e.preventDefault();

    const newReply = {
      comment: reply[reviewId],
      reviewId,
      userId: user.id,
    };
    console.log("Sending reply data:", newReply);

    createReplyMutation.mutate(newReply);
  };

  if (!product) return null;

  const firstProductItem = product?.productItems?.[0];
  const originalPrice = firstProductItem?.price || 0;
  const discountPrice = firstProductItem?.coupon?.price || 0;
  const finalPrice = originalPrice - discountPrice;

  const selectedColor = colors.find((color) => color.id === selectedColorId);

  const sizesForSelectedColor = selectedColor ? selectedColor.sizes : [];
  return (
    <Container sx={{ mt: 2 }}>
      <Breadcrumb page="Chi tiết" title={product.name} />
      <Box
        sx={{
          mt: 2,
          background: "#fff",
          borderRadius: "10px",
          p: 3,
          boxShadow: 3,
        }}
      >
        <Grid
          direction="row"
          justifyContent="center"
          alignItems="center"
          container
          spacing={5}
        >
          <Grid item md={5} xs={12}>
            <div
              className="detail-img"
              onMouseMove={handleZoom}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img ref={imageRef} src={BASE_URL_IMAGE + activeImage} alt="" />
            </div>
            <div className="product-image">
              {currentImages.length > 1 && (
                <button onClick={prev} className="image-prev">
                  <MdNavigateBefore fontSize="25px" />
                </button>
              )}
              {currentImages &&
                currentImages.map((img, index) => (
                  <div
                    onClick={() => chooseActiveImage(img)}
                    key={index}
                    className="image-wrap"
                  >
                    <img
                      width="82px"
                      height="82px"
                      src={BASE_URL_IMAGE + img}
                      alt={img}
                    />
                  </div>
                ))}
              {currentImages.length > 1 && (
                <button onClick={next} className="image-next">
                  <MdNavigateNext fontSize="25px" />
                </button>
              )}
            </div>
          </Grid>

          <Grid item md={7} xs={12}>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "23px",
                  color: "#000000CC",
                  mb: 2,
                  lineHeight: 1.5,
                  letterSpacing: "0.02em",
                }}
              >
                {product.name}
              </Typography>
              <Typography display="flex">
                <Typography component="span">{product.description}</Typography>
              </Typography>

              <Box
                sx={{
                  p: 1,
                  backgroundColor: "#FAFAFA",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                <Typography
                  sx={{
                    textDecoration: discountPrice > 0 ? "line-through" : "none",
                    fontSize: "18px",
                    ml: 1,
                    color: discountPrice > 0 ? "#707070" : "#D70018",
                    marginTop: "10px",
                    fontWeight: "500",
                    height: "30px",
                  }}
                  component="span"
                >
                  Giá:{" "}
                  {originalPrice > 0
                    ? formatCurrency(originalPrice) + " VND"
                    : "Liên hệ"}
                </Typography>
                {discountPrice > 0 && (
                  <Typography
                    sx={{
                      fontSize: "20px",
                      ml: 1,
                      color: "#D70018",
                      marginTop: "10px",
                      fontWeight: "500",
                      height: "30px",
                    }}
                    component="span"
                  >
                    Giá khuyến mãi: {formatCurrency(finalPrice)} VND
                  </Typography>
                )}
              </Box>
              <Divider sx={{ mt: 2 }} component="p" />
              <Typography display="flex" color="gray">
                <Typography
                  color="#757575"
                  component="span"
                  display="flex"
                  fontWeight="500"
                  mt={2}
                >
                  Danh Mục:
                  <Typography
                    ml={1}
                    component="span"
                    fontWeight="500"
                    color="#000"
                  >
                    {product.category?.name || "Không xác định"}
                  </Typography>
                </Typography>
              </Typography>

              <Typography display="flex" color="gray">
                <Typography
                  color="#757575"
                  component="span"
                  display="flex"
                  fontWeight="500"
                  mt={2}
                >
                  Thương hiệu:
                  <Typography
                    ml={1}
                    component="span"
                    fontWeight="500"
                    color="#000"
                  >
                    {product.brand?.name || "Không xác định"}
                  </Typography>
                </Typography>
              </Typography>

              <div style={{ display: "flex" }}>
                <Typography
                  color="#757575"
                  component="span"
                  display="flex"
                  fontWeight="500"
                  mt={2}
                >
                  Chọn màu:
                </Typography>
                {/* Render color buttons */}
                <div>
                  {colors.length > 0 &&
                    colors.map((color) => (
                      <Button
                        key={color.id}
                        variant={
                          selectedColorId === color.id
                            ? "contained"
                            : "outlined"
                        }
                        sx={{
                          backgroundColor: color.colorCode,
                          borderRadius: "50%",
                          minWidth: "30px",
                          height: "30px",
                          margin: "5px",
                          border:
                            selectedColorId === color.id
                              ? "2px solid #000"
                              : "1px solid #ccc",
                          cursor: "pointer",
                        }}
                        onClick={() => handleColorClick(color.id)}
                      />
                    ))}
                </div>
              </div>

              {/* Render sizes for selected color */}
              {selectedColorId !== null && (
                <Typography
                  color="#757575"
                  component="span"
                  display="flex"
                  fontWeight="500"
                  mt={2}
                >
                  Kích thước:
                  {sizesForSelectedColor
                    .filter((size) => size.stock > 0) // Lọc các kích thước có tồn kho > 0
                    .map((size) => (
                      <Button
                        key={size.sizeId}
                        variant={
                          selectedSizeId === size.sizeId
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => handleSizeClick(size.sizeId)}
                        sx={{
                          margin: "5px",
                          minWidth: "50px",
                          height: "36px",
                          fontWeight: 500,
                          borderRadius: "6px",
                          borderColor: "#1976d2",
                        }}
                        disabled={size.stock === 0}
                      >
                        {size.sizeName}
                      </Button>
                    ))}
                </Typography>
              )}

              {selectedColorId !== null && selectedSizeId !== null && (
                <Typography
                  color="#757575"
                  component="span"
                  display="flex"
                  fontWeight="500"
                  mt={2}
                >
                  Số lượng tồn kho là:{" "}
                  {getStockQuantity(selectedColorId, selectedSizeId)}
                </Typography>
              )}
              {error && <Alert severity="error">{error}</Alert>}
              {selectedColorId !== null &&
                selectedSizeId !== null &&
                getStockQuantity(selectedColorId, selectedSizeId) > 0 && (
                  <Box>
                    <Typography
                      color="#757575"
                      component="span"
                      display="flex"
                      fontWeight="500"
                      mt={2}
                    >
                      Số lượng:
                    </Typography>
                    <Button
                      onClick={() =>
                        setQuantity((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={
                        quantity <= 1 ||
                        selectedColorId === null ||
                        selectedSizeId === null
                      }
                    >
                      <RemoveIcon />
                    </Button>
                    <TextField
                      inputProps={{ min: 1 }}
                      value={quantity}
                      onChange={(e) => {
                        let value = parseInt(e.target.value);
                        if (value < 1) {
                          value = 1;
                        }
                        const stock = getStockQuantity(
                          selectedColorId,
                          selectedSizeId
                        );
                        if (value > stock) {
                          setError("Số lượng vượt quá số lượng tồn kho");
                          setQuantity(stock);
                        } else {
                          setQuantity(value);
                          setError("");
                        }
                      }}
                      sx={{ width: "60px", mx: 2 }}
                      size="small"
                      type="number"
                    />
                    <Button
                      onClick={() => {
                        if (
                          quantity <
                          getStockQuantity(selectedColorId, selectedSizeId)
                        ) {
                          setQuantity((prev) => prev + 1);
                          setError("");
                        } else {
                          setError("Số lượng vượt quá số lượng tồn kho");
                        }
                      }}
                      disabled={
                        quantity >=
                          getStockQuantity(selectedColorId, selectedSizeId) ||
                        selectedColorId === null ||
                        selectedSizeId === null
                      }
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                )}

              {selectedColorId !== null &&
                selectedSizeId !== null &&
                getStockQuantity(selectedColorId, selectedSizeId) > 0 && (
                  <MyButton
                    onClick={handleAddToCart}
                    fontSize="14px"
                    mt="30px"
                    width="200px"
                    height="45px"
                  >
                    <FaCartPlus fontSize="18px" />
                    Thêm vào giỏ hàng
                  </MyButton>
                )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2,
          p: 3,
          borderRadius: "5px",
          background: "#fff",
        }}
      >
        <Tabs product={product} />
      </Box>
      <Box
        component="form"
        onSubmit={handleReviewSubmit}
        sx={{ mt: 2, background: "#fff", borderRadius: "5px", p: 3 }}
      >
        <Typography variant="h6">Viết đánh giá</Typography>
        <TextField
          label="Nhận xét"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          error={createReviewMutation.isError}
        />
        <Box component="fieldset" borderColor="transparent">
          <Typography component="legend">Đánh giá</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={createReviewMutation.isLoading}
        >
          {createReviewMutation.isLoading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          mb: 2,
          p: 3,
          borderRadius: "5px",
          background: "#fff",
        }}
      >
        <Tabs product={product} />
      </Box>

      {/* Display reviews */}

      <Box sx={{ mt: 4, background: "#fff", borderRadius: "5px", p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Bình luận
        </Typography>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Box key={review.id} sx={{ mb: 2 }}>
              <Box style={{ borderBottom: "1px solid #ccc" }}>
                <Typography style={{ fontWeight: "bold" }} variant="body1">
                  {review.users?.name}
                </Typography>
                <Box style={{ padding: "10px" }}>
                  <Rating
                    style={{ fontSize: "15px" }}
                    value={review.rating}
                    readOnly
                  />
                  <Typography style={{ fontSize: "15px" }} variant="body1">
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
              {review.replies && review.replies.length > 0 && (
                <Divider sx={{ mt: 1, mb: 1 }} />
              )}
              {review.replies &&
                review.replies.map((reply) => (
                  <Box key={reply.id} sx={{ ml: 4 }}>
                    <Typography variant="body2">
                      <Box
                        sx={{
                          border: "1px solid #d6caca",
                          height: "59px",
                          width: "100%",
                          marginBottom: "10px",
                          padding: "10px",
                          borderRadius: "9px",
                          textTransform: "capitalize",
                        }}
                      >
                        Phản hồi: {reply.comment}
                      </Box>
                      <Typography component="span" color="gray">
                        {/* {reply.user.name}  */}
                      </Typography>
                    </Typography>
                  </Box>
                ))}
              {isAuthenticated && user.role === "admin" && (
                <Box
                  component="form"
                  onSubmit={(e) => handleReplySubmit(e, review.id)}
                  sx={{ mt: 2 }}
                >
                  <TextField
                    label="Phản hồi"
                    value={reply[review.id] || ""}
                    onChange={(e) =>
                      setReply({ ...reply, [review.id]: e.target.value })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Gửi phản hồi
                  </Button>
                </Box>
              )}
              {successReplyId === review.id && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {replySuccess}
                </Alert>
              )}
              {replyError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {replyError}
                </Alert>
              )}
              {review.replies && review.replies.length > 0 && (
                <Divider sx={{ mt: 1, mb: 1 }} />
              )}
            </Box>
          ))
        ) : (
          <Typography>Chưa có bình luận nào.</Typography>
        )}
      </Box>
    </Container>
  );
}
