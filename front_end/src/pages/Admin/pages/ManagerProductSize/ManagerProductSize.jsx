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
import sizeApi from "../../../../apis/size";
import { toast } from "react-toastify";

const headCells = [
  { id: "stt", label: "STT", width: "10%" },
  { id: "name", label: "Tên size", width: "60%" },
  { id: "action", label: "Hành động", width: "30%" },
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
              fontWeight: 700,
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
          placeholder="Tìm kiếm size"
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

export default function ManagerProductSize() {
  const refId = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: sizesData, refetch } = useQuery({
    queryKey: ["sizes"],
    queryFn: sizeApi.getAllSize,
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => sizeApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa size thành công");
      refetch();
    },
    onError: () => toast.error("Không thể xóa vì size có sản phẩm"),
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

  const filteredSizes = sizesData?.data?.filter((size) =>
    size.name.toLowerCase().includes(search.toLowerCase())
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
            Quản lý size
          </Typography>
          <Link to="/admin/size/create" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FaPlus />}
              sx={{ height: 45 }}
            >
              Thêm size
            </Button>
          </Link>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <EnhancedTableToolbar search={search} setSearch={setSearch} />

          <TableContainer sx={{ maxHeight: 520, borderRadius: 2, overflow: "auto" }}>
            <Table stickyHeader aria-label="sizes table" size="medium">
              <EnhancedTableHead />
              <TableBody>
                {filteredSizes?.length > 0 ? (
                  filteredSizes.map((size, index) => (
                    <TableRow
                      key={size.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell align="left" sx={{ fontWeight: 600 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{size.name}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(size.id)}
                          sx={{ mr: 1 }}
                        >
                          Xóa
                        </Button>
                        <Link
                          to={`/admin/size/update/${size.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button variant="outlined" color="primary" size="small">
                            Sửa
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                      Không tìm thấy size phù hợp
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