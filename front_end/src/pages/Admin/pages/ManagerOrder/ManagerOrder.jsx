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
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Mã đơn"
  },
  {
    id: "statusPayment",
    numeric: true,
    disablePadding: false,
    label: "Trạng thái thanh toán"
  },
  {
    id: "user",
    numeric: true,
    disablePadding: false,
    label: "Người đặt"
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email"
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Số điện thoại"
  },
  {
    id: "total_payable",
    numeric: true,
    disablePadding: false,
    label: "Tổng đơn đã giảm"
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Trạng thái"
  },
  {
    id: "address",
    numeric: true,
    disablePadding: false,
    label: "Địa chỉ"
  },
  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Hành động"
  }
];

function EnhancedTableHead() {
  return (
    <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
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
    <Toolbar
      sx={{
        py: 2,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <TextField
          placeholder="Tìm kiếm đơn hàng"
          size="medium"
          sx={{ width: "450px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Typography>

      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
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
  console.log("Orders:", orders.map((o) => o.user));


  const filteredOrders = orders.filter((order) => {
    const name = order.user?.email?.toLowerCase() || "";
    return name.includes(search.toLowerCase());
  });

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
      console.log("🚀 updateData", updateData); // Thêm dòng này
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
      setSuccessMessage("Order updated successfully");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
    }
  });

  const handleClose = (value) => {
    const id = idRef.current;
    const order = orders.find((order) => order.id === id);
    const currentStatus = order ? order.status : null;
  
    // Nếu không chọn gì thì trả về "pending"
    const selectedStatus = value || "pending";
  
    console.log("currentStatus", currentStatus);
    console.log("value", value);
    console.log("selectedStatus", selectedStatus);
  
    if (
      (currentStatus === "cancelled" &&
        (selectedStatus === "shipped" || selectedStatus === "delivered")) ||
      (currentStatus === "delivered" && selectedStatus === "shipped") ||
      (currentStatus === "pending" && selectedStatus === "delivered") ||
      (currentStatus === "shipped" && selectedStatus === "cancelled") ||
      (currentStatus === "delivered" && selectedStatus === "cancelled") ||
      (currentStatus === "delivered" && selectedStatus === "delivered") ||
      (currentStatus === "shipped" && selectedStatus === "shipped") ||
      (currentStatus === "cancelled" && selectedStatus === "cancelled")
    ) {
      toast.error("Không thể chuyển đổi Trạng thái");
      idRef.current = null;
      return;
    }
  
    setOpen(false);
    setSelectedValue(selectedStatus);
  
    // ✅ Sử dụng selectedStatus thay vì value
    updateOrderStatusMutation.mutate({ id, status: selectedStatus });
  
    idRef.current = null;
  };
  

  const handleClosePayment = (value) => {
    setOpenPayment(false);
    console.log("Selected value:", value);
    if (value !== null) {
      const id = idRef.current;
      updateOrderStatusMutation.mutate({
        id,
        status: "payment",
        statusPayment: value
      });
      idRef.current = null;
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMessage("");
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  return (
    <React.Fragment>
      <DialogStatus
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
      <DialogPayment
        currentStatus={selectedValue}
        open={openPayment}
        onClose={handleClosePayment}
      />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            mb: 2,
            px: 4,
            py: 2,
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography fontSize="24px" component="p">
            Quản lý đơn hàng
          </Typography>
        </Box>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar search={search} setSearch={setSearch} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead />
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const isSelected = selectedOrder?.id === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          width='5%'
                        >
                          {order.id}
                        </TableCell>
                        <TableCell width='15%' align="left">
                        <Button
  variant="outlined"
  onClick={() =>
    handleClickOpenPayment(order.id, order.statusPayment)
  }
>
  {convertUpdateStatuspayment(order?.statusPayment)}
</Button>

                        </TableCell>
                        <TableCell align="left">{order?.user?.name}</TableCell>
                        <TableCell align="left">{order?.user?.email}</TableCell>
                        <TableCell align="left">{order?.phone}</TableCell>
                        <TableCell width='11%' align="left">
                          {formatCurrency(order?.total_payable)} VND
                        </TableCell>
                        <TableCell align="left">
                        <Button
  color={
    order.status === "pending"
      ? "warning"
      : order.status === "shipped"
      ? "primary"
      : order.status === "delivered"
      ? "success"
      : order.status === "cancelled"
      ? "error"
      : "secondary"
  }
  onClick={() => handleClickOpen(order.id)}
  variant="outlined"
>
  {convertUpdateStatusOrder(order?.status)}
</Button>

                        </TableCell>
                        <TableCell align="left">{order?.address}</TableCell>
                        <TableCell align="left">
                          <Button
                            variant="outlined"
                            color={isSelected ? "secondary" : "primary"}
                            size="small"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedOrder(null);
                              } else {
                                handleViewDetails(order.id);
                              }
                            }}
                            sx={{ mr: 1 }}
                          >
                            {isSelected ? "Đóng chi tiết" : "Xem chi tiết"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                          <Collapse in={isSelected} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 2 }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Chi tiết đơn hàng #{order.id}
                              </Typography>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{fontWeight: 'bold'}}>Sản phẩm</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="center">Màu sắc</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="center">Size</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="center">Số lượng</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="center">Đơn giá</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}} align="right">Thành tiền</TableCell>
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
                                            margin: '0 auto'
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        {item.productItem.size.name}
                                      </TableCell>
                                      <TableCell align="center">{item.quantity}</TableCell>
                                      <TableCell align="center">
                                        {formatCurrency(item.productItem.price)} VND
                                      </TableCell>
                                      <TableCell align="center">
                                        {formatCurrency(item.productItem.price)} VND
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell colSpan={6} align="right">
                                      <strong>Tổng tiền: {formatCurrency(selectedOrder?.total)} VND</strong>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                  <TableCell colSpan={6} align="right">
                                    <strong>Giảm giá: {formatCurrency(selectedOrder?.total_discount)} VND</strong>
                                  </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell sx={{ color: '#D70018' }} colSpan={6} align="right">
                                      <strong>Thành tiền phải trả: {formatCurrency(selectedOrder?.total_payable)} VND</strong>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={successMessage}
        />
      </Box>
    </React.Fragment>
  );
}
