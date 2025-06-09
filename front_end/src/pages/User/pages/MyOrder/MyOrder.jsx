import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { FaShippingFast } from "react-icons/fa";
import orderApi from "../../../../apis/order";
import {
  convertStatusOrder,
  convertUpdateStatuspayment,
  formatCurrency,
  formatDate
} from "../../../../common";

export default function MyOrder() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const queryClient = useQueryClient();

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAllOrder(),
    enabled: true
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id) => orderApi.cancelOrderById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      alert("Hủy đơn hàng thành công");
    },
    onError: () => {
      alert("Lỗi khi hủy đơn hàng");
    }
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
            gap: 1
          }}
          component="p"
        >
          Đơn hàng của tôi
          <FaShippingFast fontSize="28px" />
        </Typography>
      </Box>
      <TableContainer sx={{ px: 2 }} component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "10%" }}>Mã đơn</TableCell>
              <TableCell sx={{ width: "15%" }} align="left">
                Ngày đặt
              </TableCell>
              <TableCell sx={{ width: "20%" }} align="left">
                Tổng tiền
              </TableCell>
              <TableCell sx={{ width: "20%" }} align="left">
                Trạng thái
              </TableCell>
              <TableCell sx={{ width: "20%" }} align="left">
                Trạng thái thanh toán
              </TableCell>
              <TableCell sx={{ width: "25%" }} align="left">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders &&
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(order.createDate)}
                  </TableCell>
                  <TableCell align="left">
                    {formatCurrency(order.total) + " VND"}
                  </TableCell>
                  <TableCell align="left" sx={{ color: "blue" }}>
                    {convertStatusOrder(order.status)}
                  </TableCell>
                  <TableCell align="left" sx={{ color: "blue" }}>
                    {convertUpdateStatuspayment(order.statusPayment)}
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: "blue" }}
                        onClick={() => handleOrderDetails(order.id)}
                      >
                        Xem chi tiết
                      </Button>
                      {/* <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy
                      </Button> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Typography gutterBottom>
            <strong>Tổng tiền:</strong>{" "}
            {formatCurrency(selectedOrder.total) + " VND"}
          </Typography>
          <Typography gutterBottom>
            <strong>Trạng thái:</strong>{" "}
            {convertStatusOrder(selectedOrder.status)}
          </Typography>
          <Typography gutterBottom>
            <strong>Trạng thái thanh toán:</strong>{" "}
            {convertUpdateStatuspayment(selectedOrder.statusPayment)}
          </Typography>
          <Typography gutterBottom>
            <strong>Địa chỉ:</strong> {selectedOrder.address}
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{fontWeight: 'bold'}}>Sản phẩm</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} width='16.6%' align="center">Màu sắc</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} width='16.6%'  align="center">Size</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} width='16.6%'  align="center">Số lượng</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} width='16.6%' align="center">Giá</TableCell>
                  <TableCell sx={{fontWeight: 'bold'}} align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedOrder.items &&
                  selectedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productItem.product.name}</TableCell>
                      <TableCell align="center">
                        <Typography
                            sx={{
                              backgroundColor: item.productItem.color.colorCode,  
                              width: "20px",               
                              height: "20px",              
                              borderRadius: "50%",         
                              border:"1px solid #ddd",
                              display: "inline-block",   
                              marginTop: '0px',
                              marginLeft: '5px'
                            }}
                          ></Typography>
                      </TableCell>
                      <TableCell align="center">{item.productItem.size.name}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="center">
                        {formatCurrency(item.productItem.product.price) + " VND"}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          item.productItem.product.price * item.quantity
                        ) + " VND"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{color: '#D70018'}} colSpan={6} align="right">
                      <strong>Tổng cộng: {formatCurrency(selectedOrder.total)} VND</strong>
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
