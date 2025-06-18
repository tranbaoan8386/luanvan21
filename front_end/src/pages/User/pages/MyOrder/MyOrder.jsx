import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaShippingFast } from "react-icons/fa";
import orderApi from "../../../../apis/order";
import { formatCurrency, formatDate } from "../../../../common";

// ✅ Hàm hiển thị Trạng thái đơn hàng
function convertStatusOrder(status) {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'đã đặt hàng':
      return <span style={{ color: '#FFA500', fontWeight: 600 }}>🕒 Chờ xác nhận</span>;
    case 'shipped':
    case 'đang giao':
      return <span style={{ color: '#1E90FF', fontWeight: 600 }}>🚚 Đang giao</span>;
    case 'delivered':
    case 'đã giao':
      return <span style={{ color: 'green', fontWeight: 600 }}>✅ Đã giao</span>;
    case 'cancelled':
    case 'đã hủy':
      return <span style={{ color: 'red', fontWeight: 600 }}>❌ Đã hủy</span>;
    default:
      return <span style={{ color: '#999' }}>Không rõ</span>;
  }
}

// ✅ Hàm hiển thị Trạng thái thanh toán
function convertUpdateStatuspayment(status) {
  const lower = status?.toLowerCase();
  if (lower === 'paid' || lower === 'đã thanh toán') {
    return <span style={{ color: 'green', fontWeight: 600 }}>💵 Đã thanh toán</span>;
  } else if (lower === 'unpaid' || lower === 'chưa thanh toán') {
    return <span style={{ color: 'red', fontWeight: 600 }}>💳 Chưa thanh toán</span>;
  } else {
    return <span style={{ color: '#999' }}>Không rõ</span>;
  }
}

export default function MyOrder() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [paymentFilter, setPaymentFilter] = React.useState("");
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const queryClient = useQueryClient();

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAllOrder(),
    enabled: true,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id) => orderApi.cancelOrderById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      alert("Hủy đơn hàng thành công");
    },
    onError: () => {
      alert("Lỗi khi hủy đơn hàng");
    },
  });

  const handleCancelOrder = (id) => {
    cancelOrderMutation.mutate(id);
  };

  const handleOrderDetails = async (id) => {
    try {
      const orderDetails = await orderApi.getOrderById(id);
      setSelectedOrder(orderDetails.data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const orders = ordersData?.data.orders;

  const filteredOrders =
    orders?.filter((order) => {
      const matchStatus =
        statusFilter === "" || order.status.toString() === statusFilter;
      const matchPayment =
        paymentFilter === "" ||
        order.statusPayment.toString() === paymentFilter;
      const keyword = searchKeyword.toLowerCase();

      const matchKeyword =
        order.id.toString().includes(keyword) ||
        order.items?.some((item) =>
          item.productItem?.product?.name?.toLowerCase()?.includes(keyword)
        );

      return matchStatus && matchPayment && matchKeyword;
    }) || [];

  return (
    <Box sx={{ backgroundColor: "#fff", width: "1000px" }}>
      <Box sx={{ p: 4 }}>
        <Typography
          sx={{
            textTransform: "capitalize",
            fontSize: "18px",
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
          component="p"
        >
          Đơn hàng của tôi <FaShippingFast fontSize="28px" />
        </Typography>

        {/* Bộ lọc */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm mã đơn hoặc tên sản phẩm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Danh sách đơn hàng */}
      <TableContainer sx={{ px: 2 }} component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Trạng thái thanh toán</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{formatDate(order.createDate)}</TableCell>
                <TableCell>{formatCurrency(order.total)} VND</TableCell>
                <TableCell>{convertStatusOrder(order.status)}</TableCell>
                <TableCell>{convertUpdateStatuspayment(order.statusPayment)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "blue" }}
                    onClick={() => handleOrderDetails(order.id)}
                  >
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không tìm thấy đơn hàng phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chi tiết đơn hàng */}
      {selectedOrder && (
  <Box sx={{ mt: 4, p: 4, backgroundColor: "#f5f5f5" }}>
    <Typography variant="h5" gutterBottom>
      Chi tiết đơn hàng
    </Typography>
    <Typography gutterBottom>
      <strong>Mã đơn:</strong> {selectedOrder.id}
    </Typography>
    <Typography gutterBottom>
      <strong>Ngày đặt:</strong> {formatDate(selectedOrder.createDate)}
    </Typography>

    {/* ✅ Tính tổng cộng từ từng sản phẩm */}
    <Typography gutterBottom>
      <strong>Tổng tiền:</strong>{" "}
      {formatCurrency(
        selectedOrder.items.reduce(
          (acc, item) => acc + item.productItem.price * item.quantity,
          0
        )
      )}{" "}
      VND
    </Typography>

    <Typography gutterBottom>
      <strong>Trạng thái:</strong> {convertStatusOrder(selectedOrder.status)}
    </Typography>
    <Typography gutterBottom>
      <strong>Trạng thái thanh toán:</strong> {convertUpdateStatuspayment(selectedOrder.statusPayment)}
    </Typography>
    <Typography gutterBottom>
      <strong>Địa chỉ:</strong> {selectedOrder.address}
    </Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sản phẩm</TableCell>
            <TableCell align="center">Màu sắc</TableCell>
            <TableCell align="center">Size</TableCell>
            <TableCell align="center">Số lượng</TableCell>
            <TableCell align="center">Giá</TableCell>
            <TableCell align="right">Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedOrder.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.productItem.product.name}</TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    backgroundColor: item.productItem.color.colorCode,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                    display: "inline-block",
                  }}
                />
              </TableCell>
              <TableCell align="center">{item.productItem.size.name}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell align="center">
                {formatCurrency(item.productItem.price)} VND
              </TableCell>
              <TableCell align="right">
                {formatCurrency(item.productItem.price * item.quantity)} VND
              </TableCell>
            </TableRow>
          ))}

          {/* ✅ Dòng tổng cộng cuối bảng */}
          <TableRow>
            <TableCell colSpan={6} align="right" sx={{ color: "#D70018" }}>
              <strong>
                Tổng cộng:{" "}
                {formatCurrency(
                  selectedOrder.items.reduce(
                    (acc, item) =>
                      acc + item.productItem.price * item.quantity,
                    0
                  )
                )}{" "}
                VND
              </strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}
    </Box>
  );
}
