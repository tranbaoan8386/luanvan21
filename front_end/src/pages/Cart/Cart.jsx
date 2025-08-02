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
  Alert,
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
  // const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  // const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState({});
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const [sdkReady, setSdkReady] = useState(false); // Define sdkReady state
  // const [districtError, setDistrictError] = useState(""); // State to store district error
  const [wardError, setWardError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cityError, setCityError] = useState("");
  const [currentAddress, setCurrentAddress] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]); // ✅ Danh sách mã có sẵn\
  const [showCouponList, setShowCouponList] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponApi.getAllCoupon();
        console.log("🎯 Mã khuyến mãi trả về:", res);
        setAvailableCoupons(res.data); // tùy backend, có thể là res.data.data
      } catch (error) {
        console.error("Lỗi lấy mã khuyến mãi:", error);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    axios
      .get("https://vietnamlabs.com/api/vietnamprovince")
      .then((res) => {
        const provinceData = res.data?.data || [];
        const mapped = provinceData.map((item, index) => ({
          name: item.province,
          code: index + 1,
          wards: item.wards,
        }));
        setCities(mapped);
      })
      .catch((err) => console.error("Lỗi tải tỉnh/thành:", err));
  }, []);

  const handleCityChange = (e) => {
    const cityCode = Number(e.target.value);
    console.log("🎯 Đã chọn tỉnh/thành phố:", cityCode);

    setSelectedCity(cityCode);
    setSelectedWard("");
    setWards([]);

    const city = cities.find((c) => c.code === cityCode);

    if (city) {
      setAddress((prev) => ({ ...prev, province: city.name }));

      const mappedWards = city.wards.map((ward, index) => ({
        id: index + 1,
        name: ward.name,
      }));

      console.log("📌 Phường/Xã đã lấy:", mappedWards); // có thể giữ

      // ✅ THÊM DÒNG NÀY để gửi lại cho mình:
      console.log(
        "📋 Danh sách tên phường:",
        mappedWards.map((w) => w.name)
      );

      setWards(mappedWards);
    } else {
      console.warn("Không tìm thấy tỉnh đã chọn trong danh sách cities");
    }
  };

  //   setAddress((prev) => ({ ...prev, district: selectedDistrict.Name }));
  //   setDistrictError("");
  // };

  // const handleDistrictChange = (e) => {
  //   const districtCode = e.target.value;
  //   setSelectedDistrict(districtCode);
  //   setSelectedWard("");
  //   setWards([]);

  //   const selectedDistrict = districts.find((d) => d.id === districtCode);
  //   setAddress((prev) => ({
  //     ...prev,
  //     district: selectedDistrict?.name || "",
  //   }));

  //   axios
  //     .get("/wards_2025_demo.json")
  //     .then((res) => {
  //       const wardList = Array.isArray(res.data)
  //         ? res.data
  //         : res.data?.data || [];
  //       console.log("✅ Danh sách phường/xã:", wardList);

  //       const filtered = wardList.filter(
  //         (ward) => ward.idDistrict === districtCode
  //       );
  //       console.log("📌 Phường/xã đã lọc:", filtered);
  //       setWards(filtered);
  //     })
  //     .catch((err) => console.error("Lỗi khi load phường/xã:", err));
  // };

  const handleWardChange = (e) => {
    const wardId = Number(e.target.value);
    const selected = wards.find((w) => w.id === wardId);
    setSelectedWard(wardId);
    setAddress((prev) => ({ ...prev, village: selected?.name || "" }));
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
    },
  });

  const deleteProductFromCartMutation = useMutation({
    mutationFn: (body) => cartApi.deleteProductCart(body),
    onSuccess: (data) => {
      if (data?.success) {
        handleRefetchCart();
        const msg = data?.data?.message || data?.message;
        if (msg) toast.success(msg);
      } else {
        const msg = data?.data?.message || data?.message || "Không rõ lý do";
        console.warn("Xoá thất bại:", msg);
        toast.warn(msg);
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể xoá sản phẩm.";

      console.warn("Không thể kết nối server khi xoá sản phẩm:", message);
      toast.error(`❌ ${message}`);
    },
  });

  const handleQuantityChange = (productItemId, newQuantity) => {
    const productItem = carts.find(
      (cart) => cart.productItem.id === productItemId
    )?.productItem;

    const parsedQuantity = Number(newQuantity);

    if (!parsedQuantity || parsedQuantity < 1) {
      setError("Số lượng phải là số nguyên dương.");
      return;
    }

    if (parsedQuantity > productItem.unitInStock) {
      setError(
        `Số lượng sản phẩm vượt quá số lượng tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
      );
      return;
    }

    setError(""); // Xóa lỗi cũ nếu nhập hợp lệ

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productItemId]: parsedQuantity,
    }));

    updateCartMutation.mutate({ productItemId, quantity: parsedQuantity });
  };

  const handleIncrement = (productItemId) => {
    const productItem = carts.find(
      (cart) => cart.productItem.id === productItemId
    )?.productItem;

    if (!productItem) return;

    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[productItemId] ?? 1;
      const newQuantity = currentQuantity + 1;

      if (newQuantity > productItem.unitInStock) {
        setError(`Số lượng vượt quá tồn kho (${productItem.unitInStock})`);
        return prevQuantities; // ❌ Không cập nhật
      }

      updateCartMutation.mutate({
        productItemId,
        quantity: newQuantity,
      });

      return {
        ...prevQuantities,
        [productItemId]: newQuantity,
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
        [productItemId]: newQuantity,
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
        const itemPrice = Number(cart.price) || 0; // ✅ GIÁ ĐÃ ÁP DỤNG KHUYẾN MÃI (NẾU CÓ)
        const quantity = quantities[cart.productItem.id] || cart.quantity;
        return total + itemPrice * quantity;
      }, 0);
    }
    return 0;
  };
  const totalCart = calculateTotalCart();

  const { data: coupon, status } = useQuery({
    queryKey: ["coupon", debouncedValue],
    queryFn: () => couponApi.getCoupon(debouncedValue),
  });

  const paypalAmount = ((totalCart - couponValue) / 30000).toFixed(2);
  const [paypalPaid, setPaypalPaid] = useState(false);

  const onSuccessPaypal = (details, data) => {
    const addr = profile?.data?.profile?.Address;

    if (!addr?.address_line || !addr?.ward || !addr?.city) {
      toast.error("Vui lòng thêm đầy đủ địa chỉ trước khi thanh toán");
      return;
    }

    const fullAddress = `${addr.address_line}, ${addr.ward}, ${addr.city}`;

    const orderData = {
      total: totalCart - couponValue,
      phone: addr.phone || profile?.data?.profile?.phone,
      email: profile?.data?.profile?.email,
      fullname: profile?.data?.profile?.name,
      address: fullAddress,
      orders_item: carts.map((cart) => ({
        productItemId: cart.productItem.id,
        quantity: quantities[cart.productItem.id] || cart.quantity,
      })),
      note,
      paymentMethod,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        setPaypalPaid(true);
        handleRefetchCart();
        carts.forEach((cart) => {
          deleteProductFromCartMutation.mutate({
            productItemId: cart.productItem.id,
          });
        });
        navigate("/");
      },
      onError: (error) => {
        toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        console.error("Error creating order:", error);
      },
    });
  };

  const addCoupon = async () => {
    if (code.trim() === "") {
      toast.warning("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const res = await couponApi.applyCoupon(code, totalCart); // 🎯 Gửi code đến BE
      const couponData = res?.data?.coupon;

      if (!couponData) {
        toast.error("Mã giảm giá không tồn tại hoặc đã hết hạn!");
        return;
      }

      const { price } = couponData;

      //Không cho áp mã nếu giá trị mã > tổng giỏ hàng
      if (price > totalCart) {
        toast.warning(
          `Mã giảm giá là ${formatCurrency(
            price
          )} nhưng tổng giỏ hàng chỉ có ${formatCurrency(
            totalCart
          )}. Không thể áp dụng.`
        );
        return;
      }

      setCouponValue(price);
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (err) {
      console.error("Lỗi khi áp mã:", err);
      const message =
        err?.response?.data?.message || "Áp dụng mã giảm giá thất bại!";
      toast.error(message);
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
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userApi.getMe(),
  });

  const handleOpenOrder = async () => {
    if (profile?.data?.profile?.Address) {
      const { street, village, province } = profile.data.profile.Address;

      const selectedCityObj = cities.find(
        (city) => city.name?.trim() === province?.trim()
      );

      if (selectedCityObj) {
        setSelectedCity(selectedCityObj.code);
        setAddress((prev) => ({ ...prev, province }));

        const wardList = selectedCityObj.wards || [];
        const selectedWardObj = wardList.find(
          (w) => w.name?.trim() === village?.trim()
        );

        if (selectedWardObj) {
          setSelectedWard(selectedWardObj.id);
          setAddress((prev) => ({ ...prev, village: selectedWardObj.name }));
        } else {
          toast.warning(
            "⚠️ Phường/Xã không tồn tại trong tỉnh/thành đã chọn. Vui lòng chọn lại."
          );
          setSelectedWard("");
          setAddress((prev) => ({ ...prev, village: "" }));
        }

        setWards(
          wardList.map((ward, index) => ({
            id: index + 1,
            name: ward.name,
          }))
        );
      }
      setAddress((prev) => ({ ...prev, street }));
      setPhone(profile?.data?.profile?.Address?.phone || "");
    }

    setOpen(true);
  };

  const addCouponMutation = useMutation({
    mutationFn: (body) => couponApi.addCoupon(body),
  });

  const createOrderMutation = useMutation({
    mutationFn: (body) => orderApi.createOrder(body),
  });

  const createAddressMutation = useMutation({
    mutationFn: (body) => addressApi.createAddress(body),
    onSuccess: async () => {
      toast.success("Địa chỉ mới đã được thêm!");
      await refetch(); // ✅ Đợi refetch hoàn tất
      setOpen(false); // ✅ Rồi mới đóng dialog
    },

    onError: (error) => {
      toast.error("Lỗi khi thêm địa chỉ. Vui lòng thử lại.");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: (body) => addressApi.createAddress(body),
    onSuccess: async () => {
      toast.success("Địa chỉ mới đã được cập nhật!");
      await refetch(); // ✅ chờ lấy dữ liệu profile mới
      setOpen(false); // ✅ rồi mới đóng form
    },
    onError: (error) => {
      console.error(" Lỗi khi cập nhật địa chỉ:", error?.response?.data);
      toast.error("Lỗi khi thêm địa chỉ. Vui lòng thử lại.");
    },
  });

  const handleAddAddress = (e) => {
    e.preventDefault();
    let hasError = false;

    // Kiểm tra số điện thoại
    if (!phone?.trim()) {
      setPhoneError("Số điện thoại không được bỏ trống");
      hasError = true;
    } else {
      setPhoneError("");
    }

    // Kiểm tra tỉnh / thành phố
    if (!selectedCity) {
      setCityError("Tỉnh / Thành phố không được bỏ trống");
      hasError = true;
    } else {
      setCityError("");
    }

    // Kiểm tra phường / xã
    if (!selectedWard) {
      setWardError("Phường / Xã không được bỏ trống");
      hasError = true;
    } else {
      setWardError("");
    }

    // Kiểm tra số nhà
    if (!address.street?.trim()) {
      setError("Số nhà không thể bỏ trống");
      hasError = true;
    } else {
      setError("");
    }

    // Nếu có lỗi, không gửi request
    if (hasError) {
      return;
    }

    // In ra dữ liệu gửi để kiểm tra
    console.log("📤 Dữ liệu gửi:", {
      address_line: address.street,
      ward: address.village,
      city: address.province,
      phone: phone,
      name: profile?.data?.profile?.name || "Khách hàng",
    });

    // Gửi request
    createAddressMutation.mutate({
      address_line: address.street?.trim() || "",
      ward: address.village?.trim() || "",
      city: address.province?.trim() || "",
      phone: phone?.trim() || "",
      name: profile?.data?.profile?.name || "Khách hàng",
    });
  };

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!phone?.trim()) {
      setPhoneError("Số điện thoại không được bỏ trống");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (!selectedCity) {
      setCityError("Tỉnh / Thành phố không được bỏ trống");
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

    if (!address.street?.trim()) {
      setError("Số nhà không thể bỏ trống");
      hasError = true;
    } else {
      setError("");
    }

    if (hasError) {
      return;
    }

    // In dữ liệu gửi (giúp debug nếu cần)
    console.log("📤 Dữ liệu cập nhật:", {
      address_line: address.street,
      ward: address.village,
      city: address.province,
      phone: phone,
      name: profile?.data?.profile?.name || "Khách hàng",
    });

    updateAddressMutation.mutate({
      address_line: address.street?.trim() || "",
      ward: address.village?.trim() || "",
      city: address.province?.trim() || "",
      phone: phone?.trim() || "",
      name: profile?.data?.profile?.name || "Khách hàng",
    });
  };

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const handlePayment = async (e) => {
    e.preventDefault();

    const addr = profile?.data?.profile?.Address;

    // ✅ Kiểm tra địa chỉ
    if (!addr?.address_line || !addr?.ward || !addr?.city) {
      toast.error("Vui lòng thêm địa chỉ trước khi đặt hàng.");
      return;
    }

    // ✅ Kiểm tra PayPal nếu cần
    if (paymentMethod === "paypal" && !paypalPaid) {
      toast.error(
        "Vui lòng hoàn tất thanh toán bằng PayPal trước khi đặt hàng."
      );
      return;
    }

    // ✅ Gửi mã giảm giá nếu có
    if (code) {
      addCouponMutation.mutate({ codeCoupon: code });
    }

    const fullAddress = `${addr.address_line}, ${addr.ward}, ${addr.district}, ${addr.city}`;
    const discount = couponValue || 0;
    const total = totalCart;
    const totalPayable = total - discount;

    try {
      const res = await createOrderMutation.mutateAsync({
        total,
        total_discount: discount,
        total_payable: totalPayable,
        phone: addr.phone || profile?.data?.profile?.phone,
        email: profile?.data?.profile?.email,
        fullname: profile?.data?.profile?.name,
        address: fullAddress,
        orders_item: carts.map((cart) => ({
          productItemId: cart.productItem.id,
          quantity: quantities[cart.productItem.id],
        })),
        note,
        paymentMethod,
      });

      // ✅ Hiển thị thông báo duy nhất từ backend
      toast.dismiss();
      toast.success(res?.data?.data?.message || "Đặt hàng thành công!");

      // ✅ Xoá giỏ hàng từng item
      for (const cart of carts) {
        try {
          await deleteProductFromCartMutation.mutateAsync({
            productItemId: cart.productItem.id,
          });
        } catch (err) {
          console.warn(
            `⚠️ Không thể xoá sản phẩm ID ${cart.productItem.id}:`,
            err
          );
        }
      }

      await handleRefetchCart();
      navigate("/");
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setOpen(false); // ✅ Đóng dialog dù thành công hay thất bại
    }
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
  //chỉnh sửa thông báo bị che
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: carts?.length > 0 ? "100vh" : "auto", // 🔥 Tự điều chỉnh theo giỏ hàng
        flex: 1,
      }}
    >
      <Box
        sx={{
          flex: 1,
          width: "100%",
          mt: "15px",
          maxWidth: "1300px",
          mx: "auto",
          px: 3,
        }}
      >
        {/* <Breadcrumb page="Giỏ hàng" /> */}
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // responsive
            gap: 3,
            alignItems: "flex-start",
            mt: 5,
          }}
        >
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
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell width="500px" component="th" scope="row">
                        <div className="cart-product">
                          <img
                            src={
                              BASE_URL_IMAGE + cart.productItem.product?.avatar
                            }
                            alt={
                              cart.productItem.product?.name || "Product Image"
                            }
                          />
                          <div className="cart-product-content">
                            <span className="cart-product-name">
                              {cart.productItem?.product?.name ||
                                "Product Name"}
                            </span>
                            <div className="cart-product-color">
                              <div style={{ color: "#c50e0e" }}>Màu sắc:</div>
                              {cart.productItem.color && (
                                <Typography
                                  sx={{
                                    backgroundColor:
                                      cart.productItem.color.colorCode,
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    border: "1px solid #ddd",
                                    display: "inline-block",
                                    marginTop: "0px",
                                    marginLeft: "5px",
                                  }}
                                ></Typography>
                              )}
                            </div>

                            <div className="cart-product-size">
                              Size: {cart.productItem.size?.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell align="right">
                        <div className="quantity">
                          <div
                            style={{
                              pointerEvents:
                                cart.quantity <= 1 ||
                                updateCartMutation.isPending
                                  ? "none"
                                  : "auto",
                              opacity:
                                cart.quantity <= 1 ||
                                updateCartMutation.isPending
                                  ? 0.5
                                  : 1,
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
                              pointerEvents:
                                updateCartMutation.isPending ||
                                quantities[cart.productItem.id] >=
                                  cart.productItem.unitInStock
                                  ? "none"
                                  : "auto",
                              opacity:
                                updateCartMutation.isPending ||
                                quantities[cart.productItem.id] >=
                                  cart.productItem.unitInStock
                                  ? 0.5
                                  : 1,
                              transition: "opacity 0.2s ease", // ✅ THÊM DÒNG NÀY
                            }}
                            onClick={() => {
                              if (
                                quantities[cart.productItem.id] <
                                cart.productItem.unitInStock
                              ) {
                                handleIncrement(cart.productItem.id);
                              }
                            }}
                            className="quantity-increment"
                          >
                            <AddIcon />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(Number(cart.price))}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          Number(cart.price) *
                            (quantities[cart.productItem.id] || cart.quantity)
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
                mt: 0,
                mb: 2,
                marginLeft: "30px",
                padding: "10px 0px",
                width: "499px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minHeight: "100%",
                height: "auto",
                "@media screen and (max-width: 600px)": {
                  width: "100%",
                },
              }}
            >
              {/* PHẦN ĐỊA CHỈ - căn trái */}
              <Box sx={{ textAlign: "left", fontSize: "16px", width: "100%" }}>
                {profile?.data?.profile?.Address ? (
                  <Box
                    sx={{
                      backgroundColor: "#fffefa",
                      border: "1px solid #f0d9b5",
                      borderRadius: "10px",
                      padding: "16px",
                      lineHeight: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    {[
                      ["Người nhận", profile?.data?.profile?.name],
                      ["Số điện thoại", profile?.data?.profile?.Address?.phone],
                      ["Tỉnh/Thành phố", profile?.data?.profile?.Address?.city],
                      ["Phường/Xã", profile?.data?.profile?.Address?.ward],
                      ["Số nhà", profile?.data?.profile?.Address?.address_line],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "140px 10px 1fr", // 3 cột: label | dấu ":" | giá trị
                          alignItems: "start",
                          mb: 0.5,
                        }}
                      >
                        <Box sx={{ fontWeight: "bold" }}>{label}</Box>
                        <Box>:</Box>
                        <Box>{value || "Chưa có"}</Box>
                      </Box>
                    ))}

                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Box
                        onClick={handleOpenOrder}
                        sx={{
                          fontSize: "14px",
                          color: "#1677ff",
                          fontWeight: 500,
                          border: "1px solid #1677ff",
                          borderRadius: "4px",
                          padding: "4px 10px",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#e6f0ff",
                          },
                        }}
                      >
                        Thay đổi địa chỉ
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      fontSize: "14px",
                      color: "#1677ff",
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                    onClick={handleOpenOrder}
                  >
                    Thêm mới địa chỉ
                  </Box>
                )}
              </Box>

              {}
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowCouponList(!showCouponList)}
                    sx={{ mb: 2 }}
                  >
                    {showCouponList
                      ? "Ẩn mã khuyến mãi"
                      : "Áp dụng mã khuyến mãi"}
                  </Button>

                  {showCouponList && (
                    <>
                      {availableCoupons.length > 0 ? (
                        availableCoupons.map((coupon) => {
                          const isEligible =
                            totalCart >= (coupon.minimumAmount || 0);

                          return (
                            <Box
                              key={coupon.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: "#f4f4f4",
                                borderRadius: "6px",
                                padding: "10px",
                                mb: 1,
                                border: "1px solid #ccc",
                                opacity: isEligible ? 1 : 0.5, // 👈 Làm mờ nếu không đủ điều kiện
                                pointerEvents: isEligible ? "auto" : "none", // 👈 Vô hiệu hóa click
                              }}
                            >
                              <Box>
                                <Typography fontWeight={600}>
                                  {coupon.code}
                                </Typography>
                                <Typography fontSize="14px" color="red">
                                  Giảm {formatCurrency(coupon.price)} VND cho
                                  đơn từ{" "}
                                  {formatCurrency(coupon.minimumAmount || 0)}{" "}
                                  VND
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!isEligible} // 👈 Tùy chọn: disable nút thay vì dùng pointerEvents
                                onClick={() => {
                                  setCode(coupon.code);
                                  addCoupon(); // Gọi hàm áp mã
                                }}
                              >
                                Áp dụng
                              </Button>
                            </Box>
                          );
                        })
                      ) : (
                        <Typography fontSize="14px" color="GrayText">
                          Không có mã nào khả dụng
                        </Typography>
                      )}
                    </>
                  )}
                </Box>

                {/* ✅ Sửa thành Box căn giữa */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Nhập mã khuyến mãi"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    sx={{ width: "60%" }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={addCoupon}
                    sx={{ height: "40px" }}
                  >
                    Xác nhận
                  </Button>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontSize="14px" color="GrayText">
                      Tổng giỏ hàng
                    </Typography>
                    <Typography color="Highlight">
                      {formatCurrency(totalCart) + " VND"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontSize="14px" color="GrayText">
                      Khuyến mãi
                    </Typography>
                    <Typography color="error">
                      {couponValue
                        ? formatCurrency(couponValue) + " VND"
                        : "Chưa áp dụng"}
                    </Typography>
                  </Box>

                  <Divider sx={{ mt: 3, mb: 1 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
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
                      {formatCurrency(totalCart - (couponValue || 0)) + " VND"}
                    </Typography>
                  </Box>

                  <ButtonCustom onClick={handlePayment} sx={{ mt: 2, mb: 3 }}>
                    Đặt hàng
                  </ButtonCustom>

                  {paymentMethod === "paypal" &&
                    sdkReady &&
                    handlePaypalPayment() && (
                      <PayPalButton
                        amount={paypalAmount}
                        onSuccess={onSuccessPaypal}
                        onError={() => {
                          toast.error("Lỗi trong quá trình thanh toán PayPal");
                        }}
                      />
                    )}
                </Box>
              </Box>
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
              color: (theme) => theme.palette.grey[500],
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
                    <MenuItem key={city.code} value={city.code}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {cityError && <Alert severity="error">{cityError}</Alert>}
              </FormControl>

              {selectedCity && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="ward-label">Phường / Xã</InputLabel>
                  <Select
                    labelId="ward-label"
                    value={selectedWard || ""}
                    onChange={handleWardChange}
                  >
                    <MenuItem value="">
                      <em>Chọn Phường / Xã</em>
                    </MenuItem>
                    {wards.map((ward) => (
                      <MenuItem key={ward.id} value={ward.id}>
                        {ward.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {wardError && <Alert severity="error">{wardError}</Alert>}
                </FormControl>
              )}

              <TextField
                sx={{ mt: 3 }}
                fullWidth
                id="outlined-helperText"
                label="Số nhà, tên đường..."
                inputProps={{
                  readOnly: false,
                }}
                value={address.street ?? ""}
                onChange={handleStreetChange}
              />
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                sx={{ mt: 3 }}
                fullWidth
                id="outlined-helperText"
                label="Số điện thoại"
                inputProps={{
                  readOnly: false,
                }}
                value={phone ?? ""}
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
                  createOrder={(data, actions) => {
                    const selectedCityName =
                      cities.find((c) => c.code === Number(selectedCity))
                        ?.name || "";
                    const selectedWardName =
                      wards.find((w) => w.id === Number(selectedWard))?.name ||
                      "";

                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: paypalAmount.toString(),
                            currency_code: "USD",
                          },
                          shipping: {
                            name: {
                              full_name:
                                profile?.data?.profile?.name || "Khách hàng",
                            },
                            address: {
                              address_line_1: address.street || "",
                              admin_area_2: selectedWardName,
                              admin_area_1: selectedCityName,
                              postal_code: "700000",
                              country_code: "VN",
                            },
                          },
                        },
                      ],
                    });
                  }}
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    toast.error("Lỗi trong quá trình thanh toán PayPal");
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
                  color: "#ee4d2d",
                }}
              >
                Tổng cộng: {formatCurrency(totalCart - couponValue) + " VND"}
              </Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
