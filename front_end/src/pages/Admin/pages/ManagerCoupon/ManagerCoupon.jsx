import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
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
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ConfirmDelete from "../../../../components/Admin/ConfirmDelete";
import couponApi from "../../../../apis/coupon";
import { toast } from "react-toastify";

const headCells = [
  { id: "stt", label: "STT", width: "5%" },
  { id: "code", label: "Mã khuyến mãi", width: "25%" },
  { id: "price", label: "Giá trị (VND)", width: "20%" },
  { id: "start", label: "Ngày bắt đầu", width: "20%" },
  { id: "end", label: "Ngày kết thúc", width: "20%" },
  { id: "action", label: "Hành động", width: "10%" },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: "#f5f5f7",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            sx={{
              fontWeight: "700",
              fontSize: 15,
              width: headCell.width,
              borderBottom: "2px solid #ddd",
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ search, setSearch }) {
  const handleClear = () => setSearch("");
  return (
    <Toolbar
      sx={{
        py: 2,
        px: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        mb: 2,
        boxShadow: "inset 0 0 5px #ddd",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
        <TextField
          placeholder="Tìm kiếm mã khuyến mãi"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            endAdornment: search ? (
              <IconButton onClick={handleClear} size="small" edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : null,
          }}
        />
      </Box>
      <Tooltip title="Lọc danh sách">
        <IconButton color="primary" sx={{ ml: 1 }}>
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

  const { data: couponsData, refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: couponApi.getAllCoupon,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      toast.success("Xóa mã thành công");
      refetch();
    },
    onError: () => toast.error("Không thể xóa mã khuyến mãi"),
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
    <>
      <ConfirmDelete onConfirm={handleConfirm} open={open} setOpen={setOpen} />
      <Box
        sx={{
          width: "100%",
          p: 3,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Quản lý mã khuyến mãi
          </Typography>
          <Link to="/admin/coupon/create" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FaPlus />}
              sx={{ height: 45 }}
            >
              Thêm mã
            </Button>
          </Link>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <EnhancedTableToolbar search={search} setSearch={setSearch} />

          <TableContainer
            sx={{ maxHeight: 520, borderRadius: 2, overflow: "auto" }}
          >
            <Table stickyHeader aria-label="coupons table" size="medium">
              <EnhancedTableHead />
              <TableBody>
                {filteredCoupons?.length > 0 ? (
                  filteredCoupons.map((coupon, index) => (
                    <TableRow
                      key={coupon.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell align="left" sx={{ fontWeight: 600 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{coupon.code}</TableCell>
                      <TableCell align="left">
                        {coupon.price.toLocaleString()}
                      </TableCell>
                      <TableCell align="left">
                        {coupon.startDate
                          ? new Date(coupon.startDate).toLocaleDateString()
                          : "---"}
                      </TableCell>
                      <TableCell align="left">
                        {coupon.endDate
                          ? new Date(coupon.endDate).toLocaleDateString()
                          : "---"}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(coupon.id)}
                          sx={{ mr: 1 }}
                        >
                          Xóa
                        </Button>
                        <Link
                          to={`/admin/coupon/update/${coupon.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                          >
                            Sửa
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      Không tìm thấy mã khuyến mãi phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}
