import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDelete from "../../../../components/Admin/ConfirmDelete";
import couponApi from "../../../../apis/coupon";
import { toast } from "react-toastify";

const headCells = [
  { id: "stt", numeric: false, disablePadding: true, label: "STT" },
  { id: "code", numeric: true, disablePadding: false, label: "Mã khuyến mãi" },
  { id: "price", numeric: true, disablePadding: false, label: "Giá trị (VND)" },
  { id: "start", numeric: true, disablePadding: false, label: "Ngày bắt đầu" },
  { id: "end", numeric: true, disablePadding: false, label: "Ngày kết thúc" },
  { id: "action", numeric: true, disablePadding: false, label: "Hành động" }
];

function EnhancedTableHead() {
  return (
    <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
      <TableRow>
        <TableCell padding="checkbox" />
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
    <Toolbar sx={{ py: 2, px: 2 }}>
      <TextField
        placeholder="Tìm kiếm mã khuyến mãi"
        size="medium"
        sx={{ width: 450 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Tooltip title="Lọc danh sách">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

export default function ManagerCoupon() {
  const refId = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: couponsData, refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponApi.getAllCoupon
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      toast.success("Xóa mã thành công");
      refetch();
    },
    onError: () => toast.error("Không thể xóa mã khuyến mãi")
  });

  const handleDelete = (id) => {
    setOpen(true);
    refId.current = id;
  };

  const handleConfirm = () => {
    deleteMutation.mutate(refId.current);
    refId.current = null;
    setOpen(false);
  };

  const filteredCoupons = couponsData?.data?.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <React.Fragment>
      <ConfirmDelete onConfirm={handleConfirm} open={open} setOpen={setOpen} />
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
            Quản lý mã khuyến mãi
          </Typography>
          <Link to="/admin/coupon/create">
            <Button sx={{ height: "55px" }} variant="outlined" color="success">
              <FaPlus
                style={{ marginBottom: "4px", marginRight: "5px" }}
                fontSize="18px"
              />
              Thêm mã
            </Button>
          </Link>
        </Box>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar search={search} setSearch={setSearch} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead />
              <TableBody>
                {filteredCoupons &&
                  filteredCoupons.map((coupon, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={coupon.id}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox" />
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell>{coupon.code}</TableCell>
                        <TableCell>{coupon.price.toLocaleString()}</TableCell>
                        <TableCell>
                          {coupon.startDate
                            ? new Date(coupon.startDate).toLocaleDateString()
                            : "---"}
                        </TableCell>
                        <TableCell>
                          {coupon.endDate
                            ? new Date(coupon.endDate).toLocaleDateString()
                            : "---"}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDelete(coupon.id)}
                            variant="outlined"
                            color="error"
                          >
                            Xóa
                          </Button>
                          <Link to={`/admin/coupon/update/${coupon.id}`}>
                            <Button
                              sx={{ ml: 1 }}
                              variant="outlined"
                              color="primary"
                            >
                              Sửa
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </React.Fragment>
  );
}
