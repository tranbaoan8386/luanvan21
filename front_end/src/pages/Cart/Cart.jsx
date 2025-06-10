import React, { useEffect, useState, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";
import { BASE_URL_IMAGE } from "../../constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import cartApi from "../../apis/cart";
import couponApi from "../../apis/coupon";
import addressApi from "../../apis/address";
import orderApi from "../../apis/order";
import userApi from "../../apis/user";
import emptyCart from "../../assets/images/empty-cart.png";
import { confirmMessage, formatCurrency } from "../../common";
import Breadcrumb from "../../components/Breadcrumb";
import ButtonCustom from "../../components/Button/ButtonCustom";
import MyButton from "../../components/MyButton";
import { PayPalButton } from "react-paypal-button-v2";
import { AppContext } from "../../contexts/App";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import paymentApi from "../../apis/payment";
import "./styles.scss";
import { textAlign } from "@mui/system";

export default function Cart() {
  const { carts, handleRefetchCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const debouncedValue = useDebounce(code, 500);
  const [couponValue, setCouponValue] = useState(null);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState({});
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const [sdkReady, setSdkReady] = useState(false); // Define sdkReady state
  const [districtError, setDistrictError] = useState(""); // State to store district error
  const [wardError, setWardError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cityError, setCityError] = useState("");
  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict("");
    setSelectedWard("");
    const selectedCity = cities.find((city) => city.Id === cityId);
    setDistricts(selectedCity ? selectedCity.Districts : []);
    setWards([]);
    setAddress((prev) => ({ ...prev, province: selectedCity.Name }));
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard("");
    const selectedDistrict = districts.find(
      (district) => district.Id === districtId
    );
    setWards(selectedDistrict ? selectedDistrict.Wards : []);
    setAddress((prev) => ({ ...prev, district: selectedDistrict.Name }));
    setDistrictError("");
  };

  const handleWardChange = (event) => {
    const wardId = event.target.value;
    const selectedWard = wards.find((ward) => ward.Id === wardId);
    setSelectedWard(wardId);
    setAddress((prev) => ({ ...prev, village: selectedWard.Name }));
    setWardError("");
  };

  const handleStreetChange = (event) => {
    setAddress((prev) => ({ ...prev, street: event.target.value }));
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    setPhoneError("");
  };

  useEffect(() => {
    if (carts) {
      const initialQuantities = {};
      carts.forEach((cart) => {
        initialQuantities[cart.productItem.id] = cart.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [carts]);

  const updateCartMutation = useMutation({
    mutationFn: (body) => cartApi.updateCart(body),
    onSuccess: () => {
      handleRefetchCart();
      setError(""); // Reset error state on successful update
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setError(error.response.data.message); // Set error message from API
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  });

  const deleteProductFromCartMutation = useMutation({
    mutationFn: (body) => cartApi.deleteProductCart(body),
    onSuccess: () => {
      handleRefetchCart();
      // Automatically refresh the page on successful deletion
    },
    onError: (error) => {
      toast.error("Lỗi khi xoá sản phẩm. Vui lòng thử lại.");
    }
  });

  const handleQuantityChange = (productItemId, newQuantity) => {
    const productItem = carts.find(
      (cart) => cart.productItem.id === productItemId
    ).productItem;
    if (Number(newQuantity) > productItem.unitInStock) {
      setError(
        `Số lượng sản phẩm vượt quá số lượng tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
      );
      return;
    }
    if (!Number(newQuantity) || newQuantity < 1) {
      setError("Số lượng phải là số dương.");
      return;
    }
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productItemId]: newQuantity
    }));
    updateCartMutation.mutate({ productItemId, quantity: newQuantity });
  };

  const handleIncrement = (productItemId) => {
    const productItem = carts.find(
      (cart) => cart.productItem.id === productItemId
    ).productItem;
    if (quantities[productItemId] + 1 > productItem.unitInStock) {
      setError(
        `Số lượng sản phẩm vượt quá số lượng tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
      );
      return;
    }
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productItemId] || 1;
      const newQuantity = currentQuantity + 1;
      updateCartMutation.mutate({ productItemId, quantity: newQuantity });
      return {
        ...prevQuantities,
        [productItemId]: newQuantity
      };
    });
  };

  const handleDecrement = (productItemId) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productItemId] || 1;
      const newQuantity = currentQuantity - 1;
      if (newQuantity < 1) return prevQuantities; // Prevent decrementing below 1
      updateCartMutation.mutate({ productItemId, quantity: newQuantity });
      return {
        ...prevQuantities,
        [productItemId]: newQuantity
      };
    });
  };

  const confirmDelete = (productItemId) => {
    confirmMessage(() => {
      deleteProductFromCartMutation.mutate({ productItemId });
    });
  };
  // Tính toán tổng tiền tất cả các sản phẩm
  const calculateTotalCart = () => {
    if (carts && carts.length > 0) {
      return carts.reduce((total, cart) => {
        const productPrice = cart.productItem?.product?.price || 0;
        const couponDiscount =
          cart.productItem?.product?.productCoupon?.price || 0;
        const quantity = quantities[cart.productItem.id] || cart.quantity;
        return total + (productPrice - couponDiscount) * quantity;
      }, 0);
    }
    return 0;
  };
  const totalCart = calculateTotalCart();

  const { data: coupon, status } = useQuery({
    queryKey: ["coupon", debouncedValue],
    queryFn: () => couponApi.getCoupon(debouncedValue)
  });

  const paypalAmount = ((totalCart - couponValue) / 30000).toFixed(2);
  const [paypalPaid, setPaypalPaid] = useState(false);
  const onSuccessPaypal = (details, data) => {
    let fullAddress = `${profile?.data?.profile?.Address?.street}, ${profile?.data?.profile?.Address?.village}, ${profile?.data?.profile?.Address?.district}, ${profile?.data?.profile?.Address?.province}`;

    const orderData = {
      total: totalCart - couponValue,
      phone: profile?.data?.profile?.Address?.phone,
      email: profile?.data?.profile?.email,
      fullname: profile?.data?.profile?.name,
      address: fullAddress,
      orders_item: carts.map((cart) => ({
        productItemId: cart.productItem.id,
        quantity: quantities[cart.productItem.id] || cart.quantity
      })),
      note,
      paymentMethod
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: (response) => {
        setPaypalPaid(true);
        handleRefetchCart();
        carts.forEach((cart) => {
          deleteProductFromCartMutation.mutate({
            productItemId: cart.productItem.id
          });
        });
        navigate("/");
      },
      onError: (error) => {
        toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        console.error("Error creating order:", error);
      }
    });
  };

  const addCoupon = async () => {
    if (code.trim() === "") {
      toast.warning("Vui lòng nhập mã giảm giá");
    } else {
      setCouponValue(null);
      if (coupon) {
        if (status === "success") {
          const couponData = coupon?.data?.coupon;
          console.log("Value of coupon:", couponData);

          if (couponData) {
            const { price } = couponData;
            console.log("Price of coupon:", price);


            setCouponValue(price);

            console.log("Value of coupon:", price);

            toast.success("Áp dụng mã giảm giá thành công!");
          } else {
            toast.error("Mã giảm giá không tồn tại hoặc hết hạn!");
          }
        } else if (status === "error") {
          toast.error("Áp dụng mã giảm giá thất bại!");
        }
      }
    }
  };

  const addpaypal = async () => {
    try {
      const { data } = await paymentApi.getConfig();
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error fetching PayPal config: ", error);
    }
  };

  useEffect(() => {
    if (!window.paypal) {
      addpaypal();
    }
    setSdkReady(true);
  }, []);

  const {
    data: profile,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userApi.getMe()
  });

  const handleOpenOrder = () => {
    // Load existing address and set form fields
    if (profile?.data?.profile?.Address) {
      const { street, village, district, province } =
        profile.data.profile.Address;

      // Set city
      const selectedCity = cities.find((city) => city.Name === province);
      setSelectedCity(selectedCity?.Id || "");

      // Set districts and wards based on selected city
      if (selectedCity) {
        const selectedDistricts = selectedCity.Districts;
        setDistricts(selectedDistricts);

        const selectedDistrict = selectedDistricts.find(
          (d) => d.Name === district
        );
        setSelectedDistrict(selectedDistrict?.Id || "");

        if (selectedDistrict) {
          const selectedWards = selectedDistrict.Wards;
          setWards(selectedWards);

          const selectedWard = selectedWards.find((w) => w.Name === village);
          setSelectedWard(selectedWard?.Id || "");
        }
      }

      setAddress({ street, village, district, province });
    }
    setPhone(profile?.data?.profile?.Address?.phone || "");
    setOpen(true);
  };
  const addCouponMutation = useMutation({
    mutationFn: (body) => couponApi.addCoupon(body)
  });

  const createOrderMutation = useMutation({
    mutationFn: (body) => orderApi.createOrder(body)
  });

  const createAddressMutation = useMutation({
    mutationFn: (body) => addressApi.createAddress(body),
    onSuccess: () => {
      toast.success("Địa chỉ mới đã được thêm!");
      setOpen(false);
      refetch(); // Làm mới dữ liệu profile sau khi thêm địa chỉ mới
    },
    onError: (error) => {
      toast.error("Lỗi khi thêm địa chỉ. Vui lòng thử lại.");
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: (body) => addressApi.createAddress(body),
    onSuccess: () => {
      toast.success("Địa chỉ mới đã được cập nhật!");
      setOpen(false);
      refetch(); // Làm mới dữ liệu profile sau khi thêm địa chỉ mới
    },
    onError: (error) => {
      toast.error("Lỗi khi thêm địa chỉ. Vui lòng thử lại.");
    }
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!phone) {
      setPhoneError("Số điện thoại không được bỏ trống");
      hasError = true;
    } else {
      setPhoneError("");
    }
    if (!selectedCity) {
      setCityError("Tinh/ Thanh pho khong fuoc bo trong");
      hasError = true;
    } else {
      setCityError("");
    }
    if (!selectedWard) {
      setWardError("Phường / Xã không được bỏ trống");
      hasError = true;
    } else {
      setWardError("");
    }

    if (!selectedDistrict) {
      setDistrictError("Quận / Huyện không được bỏ trống");
      hasError = true;
    } else {
      setDistrictError("");
    }
    if (!address.street) {
      setError("Số nhà không thể bỏ trống");
      hasError = true;
    } else {
      setError("");
    }
    if (hasError) {
      return;
    }
    createAddressMutation.mutate({
      street: address.street,
      village: address.village,
      district: address.district,
      province: address.province,
      phone: phone
    });
  };

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!phone) {
      setPhoneError("Số điện thoại không được bỏ trống");
      hasError = true;
    } else {
      setPhoneError("");
    }
    if (!selectedCity) {
      setCityError("Tỉnh/ Thành phố không được bỏ trống");
      hasError = true;
    } else {
      setCityError("");
    }
    if (!selectedWard) {
      setWardError("Phường / Xã không được bỏ trống");
      hasError = true;
    } else {
      setWardError("");
    }

    if (!selectedDistrict) {
      setDistrictError("Quận / Huyện không được bỏ trống");
      hasError = true;
    } else {
      setDistrictError("");
    }
    if (!address.street) {
      setError("Số nhà không thể bỏ trống");
      hasError = true;
    } else {
      setError("");
    }
    if (hasError) {
      return;
    }

    updateAddressMutation.mutate({
      street: address.street,
      village: address.village,
      district: address.district,
      province: address.province,
      phone: phone
    });
  };

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handlePayment = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu user chưa có địa chỉ
    if (
      !profile?.data?.profile?.Address?.street ||
      !profile?.data?.profile?.Address?.village ||
      !profile?.data?.profile?.Address?.district ||
      !profile?.data?.profile?.Address?.province
    ) {
      toast.error("Vui lòng thêm địa chỉ trước khi đặt hàng.");
      return;
    }
    if (paymentMethod === "paypal" && !paypalPaid) {
      toast.error(
        "Vui lòng hoàn tất thanh toán bằng PayPal trước khi đặt hàng."
      );
      return;
    }

    if (code) {
      addCouponMutation.mutate({ codeCoupon: code });
    }
    let fullAddress = `${profile?.data?.profile?.Address?.street}, ${profile?.data?.profile?.Address?.village}, ${profile?.data?.profile?.Address?.district}, ${profile?.data?.profile?.Address?.province}`;

    try {
      await createOrderMutation.mutateAsync({
        total: totalCart - couponValue,
        phone,
        email: profile?.data?.profile?.email,
        fullname: profile?.data?.profile?.name,
        address: fullAddress,
        orders_item: carts.map((cart) => ({
          productItemId: cart.productItem.id,
          quantity: quantities[cart.productItem.id]
        })),
        note,
        paymentMethod
      });

      for (const cart of carts) {
        await deleteProductFromCartMutation.mutateAsync({
          productItemId: cart.productItem.id
        });
      }
      // toast.success("Địa chỉ mới đã được thêm!");
      handleRefetchCart();
      navigate("/");
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    }

    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePaypalPayment = () => {
    // Kiểm tra thông tin địa chỉ
    if (!profile?.data?.profile?.Address) {
      toast.error("Vui lòng thêm địa chỉ giao hàng trước khi thanh toán");
      return false;
    }

    // Kiểm tra giỏ hàng
    if (!carts || carts.length === 0) {
      toast.error("Giỏ hàng trống");
      return false;
    }

    // Kiểm tra số lượng
    for (const cart of carts) {
      if (!quantities[cart.productItem.id] && !cart.quantity) {
        toast.error("Có lỗi với số lượng sản phẩm");
        return false;
      }
    }

    return true;
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Breadcrumb page="Giỏ hàng" />
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ display: "flex" }}>
        <TableContainer sx={{ mt: 5, height: "100%" }} component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Số lượng</TableCell>
                <TableCell align="right">Đơn giá</TableCell>
                <TableCell align="right">Tổng&nbsp;(VND)</TableCell>
                <TableCell>Xóa</TableCell>
              </TableRow>
            </TableHead>
            {carts && carts.length > 0 ? (
              <TableBody>
                {carts.map((cart) => (
                  <TableRow
                    key={cart.id}
                    sx={{
                      height: "100px",
                      "&:last-child td, &:last-child th": { border: 0 }
                    }}
                  >
                    <TableCell width="500px" component="th" scope="row">
                      <div className="cart-product">
                        <img
                          src={BASE_URL_IMAGE + cart.productItem.product?.image}
                          alt={
                            cart.productItem.products?.name || "Product Image"
                          }
                        />
                        <div className="cart-product-content">
                          <span className="cart-product-name">
                            {cart.productItem?.product?.name || "Product Name"}
                          </span>
                          <p className="cart-product-color">
                            <div style={{color:'#c50e0e' } }>Màu sắc:</div> {cart.productItem.colorInfo && (
                            // <p className="cart-product-color">
                            //   Màu: {cart.productItem.colorInfo.colorCode}
                            // </p>
                              <Typography
                              sx={{
                                backgroundColor: cart.productItem.colorInfo.colorCode,  // Đặt nền màu bằng tên màu Hex
                                width: "20px",               // Kích thước của màu sắc
                                height: "20px",              // Kích thước của màu sắc
                                borderRadius: "50%",         // Để hình tròn
                                border:"1px solid #ddd",
                                display: "inline-block",     // Hiển thị kiểu inline để gắn với text
                                marginTop: '0px',
                                marginLeft: '5px'
                              }}
                              ></Typography>
                            
                            )}
                          
                          {/* <Typography color="black">{cart.color.colorCode}</Typography> */}
                          </p>

                          <p className="cart-product-size">
                            Size: {cart.productItem.sizeInfo.name}
                          </p>
                        </div>
                        
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="quantity">
                        <div
                          style={{
                            pointerEvents:
                              cart.quantity <= 1 || updateCartMutation.isPending
                                ? "none"
                                : "auto",
                            opacity:
                              cart.quantity <= 1 || updateCartMutation.isPending
                                ? 0.5
                                : 1
                          }}
                          onClick={() => handleDecrement(cart.productItem.id)}
                          className="quantity-decrement"
                        >
                          <RemoveIcon />
                        </div>
                        <input
                          onChange={(e) =>
                            handleQuantityChange(
                              cart.productItem.id,
                              e.target.value
                            )
                          }
                          value={
                            quantities[cart.productItem.id] || cart.quantity
                          }
                          min={1}
                          type="text"
                        />
                        <div
                          style={{
                            pointerEvents: updateCartMutation.isPending
                              ? "none"
                              : "auto",
                            opacity: updateCartMutation.isPending ? 0.5 : 1
                          }}
                          onClick={() => handleIncrement(cart.productItem.id)}
                          className="quantity-increment"
                        >
                          <AddIcon />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                     
                      {formatCurrency(
                        cart.productItem?.product?.price -
                        cart.productItem.product.productCoupon.price
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        (cart.productItem?.product?.price -
                          cart.productItem.product.productCoupon.price) *
                        (quantities[cart.productItem.id] || cart.quantity) // Ensure quantity is a number
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => confirmDelete(cart.productItem.id)}
                      >
                        <DeleteSweepIcon
                          sx={{ width: "25px", height: "25px" }}
                          color="error"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }} colSpan={5}>
                    <img
                      width={180}
                      height={180}
                      src={emptyCart}
                      alt="empty-cart"
                    />
                    <Link
                      style={{ textAlign: "center", display: "block" }}
                      to="/"
                    >
                      <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="primary"
                      >
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {carts && carts.length > 0 && (
          <Box
            sx={{
              justifyContent: "end",
              alignItems: "center",
              background: "#fff",
              mt: 9,
              mb: 2,
              marginLeft: "30px",
              // alignItems: "center",
              textAlign: "center",
              // justifyContent: "center",
              padding: "10px 0px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              width: "499px",
              "@media screen and (max-width: 600px)": {
                width: "100%",
                display: "block"
              }
            }}
          >
            <Box sx={{ fontSize: "18px" }}>
              Địa chỉ:
              {profile?.data?.profile?.Address ? (
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ fontSize: "15px", width: "250px" }}>
                    {profile?.data?.profile?.Address?.street}, 
                    {profile?.data?.profile?.Address?.village}, 
                    {profile?.data?.profile?.Address?.district}, 
                    {profile?.data?.profile?.Address?.province}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "13px",
                      color: "blue"
                    }}
                    onClick={handleOpenOrder}
                  >
                    Thay đổi
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    fontSize: "13px",
                    color: "blue",
                    cursor: "pointer"
                  }}
                  onClick={handleOpenOrder}
                >
                  Thêm mới
                </Box>
              )}
            </Box><br></br>
            <Box
              sx={{
                display: "flex"
              }}
            >
              <Box>
                <Typography
                  mb={1}
                  fontSize="15px"
                  fontWeight="500"
                  component="p"
                >
                  Mã khuyến mãi (nếu có)
                </Typography>
                <div className="cart-promotion">
                  <div className="cart-promotion-form">
                    <input
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
                      type="text"
                    />
                    <button onClick={addCoupon}>Xác nhận</button>
                  </div>
                </div>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      fontSize="14px"
                      color="GrayText"
                      component="span"
                    >
                      Tổng giỏ hàng
                    </Typography>
                    <Typography color="Highlight" component="span">
                      {formatCurrency(totalCart) + " VND"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      fontSize="14px"
                      color="GrayText"
                      component="span"
                    >
                      Khuyến mãi
                    </Typography>
                    <Typography color="error" component="span">
                      {couponValue
                        ? formatCurrency(couponValue) + " VND"
                        : "Chưa áp dụng"}
                    </Typography>
                  </Box>
                  <Divider sx={{ mt: 3, mb: 1 }} component="li" />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <Typography
                      fontWeight="500"
                      fontSize="25px"
                      color="#000000CC"
                      component="span"
                    >
                      TỔNG
                    </Typography>
                    <Typography
                      fontWeight="800"
                      fontSize="25px"
                      color="#000000CC"
                      component="span"
                    >
                      {formatCurrency(totalCart - couponValue) + " VND"}
                    </Typography>
                  </Box>
                  <ButtonCustom onClick={handlePayment} sx={{ mt: 2, mb: 5 }}>
                    Đặt hàng
                  </ButtonCustom>
                </Box>
              </Box>
            </Box>
            {paymentMethod === "paypal" && sdkReady && handlePaypalPayment() ? (
              <PayPalButton
                amount={paypalAmount}
                onSuccess={onSuccessPaypal}
                onError={() => {
                  toast.error("Lỗi trong quá trình thanh toán PayPal");
                }}
              />
            ) : (
              <Box></Box>
            )}
          </Box>
        )}
      </Box>
      {carts && carts.length > 0 && (
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Thanh toán khi nhận hàng"
          />
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label="Thanh toán bằng PAYPAL"
          />
        </RadioGroup>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {profile?.data?.profile?.Address
            ? "Cập nhật địa chỉ"
            : "Thêm địa chỉ"}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box
            onSubmit={
              profile?.data?.profile?.Address
                ? handleUpdateAddress
                : handleAddAddress
            }
            method="POST"
            component="form"
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="city-label">Tỉnh / Thành phố</InputLabel>
              <Select
                labelId="city-label"
                value={selectedCity}
                onChange={handleCityChange}
              >
                <MenuItem value="">
                  <em>Chọn Tỉnh / Thành phố</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.Id} value={city.Id}>
                    {city.Name}
                  </MenuItem>
                ))}
              </Select>
              {cityError && <Alert severity="error">{cityError}</Alert>}
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={!selectedCity}>
              <InputLabel id="district-label">Quận / Huyện</InputLabel>
              <Select
                labelId="district-label"
                value={selectedDistrict}
                onChange={handleDistrictChange}
              >
                <MenuItem value="">
                  <em>Chọn Quận / Huyện</em>
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.Id} value={district.Id}>
                    {district.Name}
                  </MenuItem>
                ))}
              </Select>
              {districtError && <Alert severity="error">{districtError}</Alert>}
            </FormControl>
            <FormControl fullWidth margin="normal" x={!selectedDistrict}>
              <InputLabel id="ward-label">Phường / Xã</InputLabel>
              <Select
                labelId="ward-label"
                value={selectedWard}
                onChange={handleWardChange}
              >
                <MenuItem value="">
                  <em>Chọn Phường / Xã</em>
                </MenuItem>
                {wards.map((ward) => (
                  <MenuItem key={ward.Id} value={ward.Id}>
                    {ward.Name}
                  </MenuItem>
                ))}
              </Select>
              {wardError && <Alert severity="error">{wardError}</Alert>}
            </FormControl>
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              id="outlined-helperText"
              label="Số nhà, tên đường..."
              inputProps={{
                readOnly: false
              }}
              value={address.street}
              onChange={handleStreetChange}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              id="outlined-helperText"
              label="Số điện thoại"
              inputProps={{
                readOnly: false
              }}
              value={phone}
              onChange={handlePhoneChange}
            />
            {phoneError && <Alert severity="error">{phoneError}</Alert>}

            <FormLabel
              sx={{ fontSize: "14px", color: "#00000099", mt: 2, ml: 2 }}
              id="demo-row-radio-buttons-group-label"
            >
              Hình thức thanh toán
            </FormLabel>
            {paymentMethod === "paypal" && sdkReady ? (
              <PayPalButton
                amount={paypalAmount}
                onSuccess={onSuccessPaypal}
                onError={() => {
                  alert("ERRO");
                }}
                key={"TEST"}
              />
            ) : (
              <MyButton
                type="submit"
                onClick={
                  profile?.data?.profile?.Address
                    ? handleUpdateAddress
                    : handleAddAddress
                }
                mt="20px"
                height="40px"
                fontSize="16px"
                width="100%"
              >
                {profile?.data?.profile?.Address
                  ? "Cập nhật địa chỉ"
                  : "Thêm địa chỉ"}
              </MyButton>
            )}
            <Typography
              sx={{
                textAlign: "right",
                my: 3,
                fontSize: "20px",
                fontWeight: "500",
                color: "#ee4d2d"
              }}
            >
              Tổng cộng: {formatCurrency(totalCart - couponValue) + " VND"}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
