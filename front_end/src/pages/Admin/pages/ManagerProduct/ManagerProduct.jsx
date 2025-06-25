import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, TextField } from "@mui/material";
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
import {
  useNavigate,
  createSearchParams,
  useParams,
  Link
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import productApi from "../../../../apis/product";
import { formatCurrency } from "../../../../common";
import useQuertConfig from "../../../../hooks/useQuertConfig";
import Pagination from "./modules/Pagination";
import { BASE_URL_IMAGE } from "../../../../constants";
import ConfirmDelete from "../../../../components/Admin/ConfirmDelete";
import { toast } from "react-toastify";

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein
  };
}

const rows = [];

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Tên sản phẩm"
  },
  {
    id: "photo",
    numeric: true,
    disablePadding: false,
    label: "Hình ảnh"
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Giá tiền",
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Danh mục"
  },
  {
    id: "brand",
    numeric: true,
    disablePadding: false,
    label: "Thương hiệu"
  },
  {
    id: "Hành động",
    numeric: true,
    disablePadding: false,
    label: "Hành động"
  }
];

function EnhancedTableHead() {
  return (
    <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar() {
  const navigate = useNavigate();
  const queryConfig = useQuertConfig();
  const { register, handleSubmit } = useForm();

  const handleSearch = handleSubmit((data) => {
    navigate({
      pathname: "/admin/product",
      search: createSearchParams({
        ...queryConfig,
        name: data.name,
      }).toString(),
    });
  });

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
      component="form"
      onSubmit={handleSearch}
    >
      <TextField
        {...register("name")}
        placeholder="Tìm kiếm sản phẩm"
        size="small"
        fullWidth
        sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1}}
      />
      <Tooltip title="Lọc danh sách">
        <IconButton color="primary" sx={{ ml: 1 }}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}


export default function ManagerProduct() {
  const refId = React.useRef(null);
  const queryConfig = useQuertConfig();
  const { data: producstData, refetch } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => {
      return productApi.getAllProduct(queryConfig);
    },
    keepPreviousData: true
  });
  const products = producstData?.data.products;
  const pageSize = producstData?.data.pagination.page_size;

  const [open, setOpen] = React.useState(false);

  const handleDelete = (id) => {
    setOpen(true);
    refId.current = id;
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => productApi.deleteProduct(id),
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      toast.error('Không thể xóa vì sản phẩm đã được đặt hàng');
    }
  });

  const handleConfirm = () => {
    const idDelete = refId.current;
    deleteMutation.mutate(idDelete);
    refId.current = null;
    setOpen(false);
  };

  return (
    <>
      <ConfirmDelete open={open} setOpen={setOpen} onConfirm={handleConfirm} />
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
            Quản lý sản phẩm
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link to="/admin/product/deleted" style={{ textDecoration: "none" }}>
              <Button  
                variant="contained"
                color="error"
                startIcon={<FaPlus />}
                sx={{ height: 45 }}>
                Sản phẩm đã xóa
              </Button>
            </Link>
            <Link to="/admin/product/create" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<FaPlus />}
                sx={{ height: 45 }}
              >
                Thêm sản phẩm
              </Button>
            </Link>
          </Box>
        </Box>
  
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
          <EnhancedTableToolbar />
          <TableContainer sx={{ maxHeight: 600, borderRadius: 2 }}>
            <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead />
              <TableBody>
                {products?.map((product, index) => (
                  <TableRow
                    hover
                    key={product.id}
                    sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell align="center">
                      <img
                        width="70"
                        src={
                          product?.avatar?.startsWith("http")
                            ? product.avatar
                            : BASE_URL_IMAGE + product.avatar
                        }
                        alt="Ảnh"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {typeof product.price === "number"
                        ? `${formatCurrency(product.price)} VND`
                        : "Không rõ"}
                    </TableCell>
                    <TableCell align="center">{product.category?.name || "Không rõ"}</TableCell>
                    <TableCell align="center">{product.brand?.name || "Không rõ"}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Xóa
                      </Button>
                      <Link
                        to={`/admin/product/update/${product.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="outlined" color="primary" size="small">
                          Sửa
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
  
          <Box sx={{ display: "flex", justifyContent: "end", pt: 3 }}>
            <Pagination pageSize={pageSize} queryConfig={queryConfig} />
          </Box>
        </Paper>
      </Box>
    </>
  );
  
}
