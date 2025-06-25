import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, TextField, Snackbar } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import Collapse from '@mui/material/Collapse';

import {
  convertUpdateStatusOrder,
  convertUpdateStatuspayment,
  formatCurrency
} from "../../../../common";
import orderApi from "../../../../apis/order";
import DialogStatus from "../ManagerOrder/DialogStatus";
import DialogPayment from "../ManagerOrder/DialogPayment";
import { toast } from "react-toastify";

const headCells = [
  { id: "id", label: "Mã đơn" },
  { id: "statusPayment", label: "Trạng thái thanh toán" },
  { id: "user", label: "Người đặt" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Số điện thoại" },
  { id: "total_payable", label: "Tổng đơn đã giảm" },
  { id: "status", label: "Trạng thái" },
  { id: "address", label: "Địa chỉ" },
  { id: "action", label: "Hành động" }
];

function EnhancedTableHead() {
  return (
    <TableHead sx={{ backgroundColor: "#F9FAFB", position: 'sticky', top: 0, zIndex: 1 }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            sx={{ fontWeight: "bold" }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ search, setSearch }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        flexWrap: "wrap",
        gap: 2
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Danh sách đơn hàng
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Tìm kiếm đơn hàng theo email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: 300 }}
      />
    </Box>
  );
}

export default function ManagerOrder() {
  const idRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedValue, setSelectedValue] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  const { data: ordersData, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getAllOrder(),
    keepPreviousData: true
  });

  const orders = ordersData?.data.orders || [];
  const filteredOrders = orders.filter((order) =>
    order.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleClickOpen = (id) => {
    setOpen(true);
    idRef.current = id;
  };

  const handleClickOpenPayment = (id, currentStatus) => {
    setOpenPayment(true);
    idRef.current = id;
    setSelectedValue(currentStatus);
  };

  const updateOrderStatusMutation = useMutation({
    mutationFn: async (updateData) => {
      switch (updateData.status) {
        case "cancelled":
          await orderApi.setCancelledOrder(updateData.id);
          break;
        case "shipped":
          await orderApi.setShipperOrder(updateData.id);
          break;
        case "delivered":
          await Promise.all([
            orderApi.setDeliveredOrder(updateData.id),
            orderApi.setPaymentOrder(updateData.id, { statusPayment: "paid" })
          ]);
          break;
        case "payment":
          await orderApi.setPaymentOrder(updateData.id, {
            statusPayment: updateData.statusPayment
          });
          break;
        default:
          throw new Error("Invalid status");
      }
    },
    onSuccess: () => {
      setSuccessMessage("Cập nhật đơn hàng thành công");
      refetch();
    },
    onError: () => toast.error("Lỗi cập nhật đơn hàng")
  });

  const handleClose = (value) => {
    const id = idRef.current;
    const order = orders.find((o) => o.id === id);
    const currentStatus = order?.status || "";
    const selectedStatus = value || "pending";

    const invalidTransition =
      (currentStatus === "cancelled" && ["shipped", "delivered"].includes(selectedStatus)) ||
      (currentStatus === "delivered" && ["shipped", "cancelled"].includes(selectedStatus)) ||
      (currentStatus === "shipped" && selectedStatus === "cancelled") ||
      currentStatus === selectedStatus;

    if (invalidTransition) {
      toast.error("Không thể chuyển trạng thái này");
      idRef.current = null;
      return;
    }

    setOpen(false);
    setSelectedValue(selectedStatus);
    updateOrderStatusMutation.mutate({ id, status: selectedStatus });
    idRef.current = null;
  };

  const handleClosePayment = (value) => {
    setOpenPayment(false);
    if (value !== null) {
      const id = idRef.current;
      updateOrderStatusMutation.mutate({ id, status: "payment", statusPayment: value });
      idRef.current = null;
    }
  };

  const handleSnackbarClose = () => setSuccessMessage("");

  const handleViewDetails = async (orderId) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  return (
    <>
      <DialogStatus selectedValue={selectedValue} open={open} onClose={handleClose} />
      <DialogPayment currentStatus={selectedValue} open={openPayment} onClose={handleClosePayment} />

      <Box sx={{ width: "100%", maxWidth: "1600px", mx: "auto", px: 2 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <EnhancedTableToolbar search={search} setSearch={setSearch} />
          <TableContainer>
            <Table>
              <EnhancedTableHead />
              <TableBody>
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      <TableRow>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleClickOpenPayment(order.id, order.statusPayment)}
                          >
                            {convertUpdateStatuspayment(order?.statusPayment)}
                          </Button>
                        </TableCell>
                        <TableCell>{order?.user?.name}</TableCell>
                        <TableCell>{order?.user?.email}</TableCell>
                        <TableCell>{order?.phone}</TableCell>
                        <TableCell>{formatCurrency(order?.total_payable)} VND</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color={
                              order.status === "pending"
                                ? "warning"
                                : order.status === "shipped"
                                ? "primary"
                                : order.status === "delivered"
                                ? "success"
                                : "error"
                            }
                            onClick={() => handleClickOpen(order.id)}
                          >
                            {convertUpdateStatusOrder(order?.status)}
                          </Button>
                        </TableCell>
                        <TableCell>{order?.address}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            color={isSelected ? "secondary" : "primary"}
                            onClick={() =>
                              isSelected
                                ? setSelectedOrder(null)
                                : handleViewDetails(order.id)
                            }
                          >
                            {isSelected ? "Đóng" : "Chi tiết"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {isSelected && (
                        <TableRow>
                          <TableCell colSpan={9} sx={{ bgcolor: "#FAFAFA" }}>
                            <Collapse in={isSelected} timeout="auto" unmountOnExit>
                              <Box sx={{ my: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Chi tiết đơn hàng #{order.id}
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Sản phẩm</TableCell>
                                      <TableCell align="center">Màu sắc</TableCell>
                                      <TableCell align="center">Size</TableCell>
                                      <TableCell align="center">Số lượng</TableCell>
                                      <TableCell align="center">Đơn giá</TableCell>
                                      <TableCell align="right">Thành tiền</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {selectedOrder?.items?.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.productItem.product.name}</TableCell>
                                        <TableCell align="center">
                                          <Box
                                            sx={{
                                              width: 20,
                                              height: 20,
                                              borderRadius: '50%',
                                              backgroundColor: item.productItem.color.colorCode,
                                              border: '1px solid #ddd',
                                              mx: 'auto'
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell align="center">{item.productItem.size.name}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="center">{formatCurrency(item.productItem.price)} VND</TableCell>
                                        <TableCell align="right">{formatCurrency(item.productItem.price)} VND</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell colSpan={6} align="right">
                                        <strong>Tổng: {formatCurrency(selectedOrder?.total)} VND</strong>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell colSpan={6} align="right">
                                        <strong>Giảm giá: {formatCurrency(selectedOrder?.total_discount)} VND</strong>
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell colSpan={6} align="right" sx={{ color: "#D70018" }}>
                                        <strong>Thành tiền: {formatCurrency(selectedOrder?.total_payable)} VND</strong>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={successMessage}
        />
      </Box>
    </>
  );
}