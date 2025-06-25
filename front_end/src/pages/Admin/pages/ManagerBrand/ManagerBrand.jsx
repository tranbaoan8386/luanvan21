import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import brandApi from "../../../../apis/brand";
import ConfirmDelete from "../../../../components/Admin/ConfirmDelete";
import { toast } from "react-toastify";

const headCells = [
  { id: "stt", label: "STT", width: "10%" },
  { id: "name", label: "Tên thương hiệu", width: "60%" },
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

function EnhancedTableToolbar({ searchQuery, setSearchQuery }) {
  const handleClear = () => setSearchQuery("");

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
          placeholder="Tìm kiếm thương hiệu"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            endAdornment: searchQuery ? (
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

export default function ManagerBrand() {
  const refId = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { data: brandsData, refetch } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.getAllBrand(),
    keepPreviousData: true,
  });
  const brands = brandsData?.data || [];

  const handleDelete = (id) => {
    setOpen(true);
    refId.current = id;
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => brandApi.delete(id),
    onSuccess: () => {
      refetch();
      toast.success("Xóa thương hiệu thành công");
    },
    onError: () => {
      toast.error("Không thể xóa vì thương hiệu có sản phẩm");
    },
  });

  const handleConfirm = () => {
    const idDelete = refId.current;
    deleteMutation.mutate(idDelete);
    refId.current = null;
    setOpen(false);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            Quản lý thương hiệu
          </Typography>
          <Link to="/admin/brand/create" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FaPlus />}
              sx={{ height: 45 }}
            >
              Thêm thương hiệu
            </Button>
          </Link>
        </Box>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <EnhancedTableToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <TableContainer sx={{ maxHeight: 520, borderRadius: 2, overflow: "auto" }}>
            <Table stickyHeader aria-label="brands table" size="medium">
              <EnhancedTableHead />
              <TableBody>
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand, index) => (
                    <TableRow
                      key={brand.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell align="left" sx={{ fontWeight: 600 }}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{brand.name}</TableCell>
                      <TableCell align="left">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(brand.id)}
                          sx={{ mr: 1 }}
                        >
                          Xóa
                        </Button>
                        <Link
                          to={`/admin/brand/update/${brand.id}`}
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
                      Không tìm thấy thương hiệu phù hợp
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
