import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import productApi from "../../../../apis/product";
import { formatCurrency } from "../../../../common";

const BASE_URL_IMAGE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/uploads/`
  : "http://localhost:8000/uploads/";

const headCells = [
  { id: "id", label: "Mã sản phẩm" },
  { id: "avatar", label: "Ảnh đại diện" },
  { id: "product", label: "Tên sản phẩm" },
  { id: "color", label: "Màu sắc" },
  { id: "size", label: "Kích thước" },
  { id: "price", label: "Giá bán" },
  { id: "unitInStock", label: "Tồn kho" },
  { id: "sold", label: "Đã bán" },
];

export default function ManagerInventory() {
  const queryClient = useQueryClient();
  const [editStock, setEditStock] = useState({});

  const { data } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await productApi.getInventory();
      return res;
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, unitInStock }) =>
      productApi.updateInventory(id, unitInStock),
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
    },
  });

  const inventory = data || [];

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h5" fontWeight={700} color="text.primary" mb={3}>
        Quản lý tồn kho
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
        <TableContainer sx={{ maxHeight: 600, borderRadius: 2 }}>
          <Table stickyHeader sx={{ minWidth: 750 }}>
            <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align="center">
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell align="center">{item.id}</TableCell>
                  <TableCell align="center">
                    {item.product?.avatar ? ( 
                      <img
                        src={
                          item.product.avatar.startsWith("http")
                            ? item.product.avatar
                            : BASE_URL_IMAGE + item.product.avatar
                        }
                        alt="avatar"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      "Không có"
                    )}
                  </TableCell>
                  <TableCell align="center">{item.product?.name || "Không rõ"}</TableCell>
                  <TableCell align="center">{item.color?.name || "Không rõ"}</TableCell>
                  <TableCell align="center">{item.size?.name || "Không rõ"}</TableCell>
                  <TableCell align="center">{formatCurrency(item.price)} VND</TableCell>

                  {/* TỒN KHO: cho phép chỉnh sửa */}
                  <TableCell align="center">
                    <TextField
                      size="small"
                      type="number"
                      inputProps={{ min: 0 }}
                    value={
                    editStock[item.id] !== undefined
                        ? String(editStock[item.id])
                        : item.unitInStock != null
                        ? String(item.unitInStock)
                        : ""
                    }

                      onChange={(e) =>
                        setEditStock((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      sx={{ width: 70, mr: 1 }}
                    />
<Button
  variant="contained"
  size="small"
  onClick={() =>
    updateInventoryMutation.mutate({
      id: item.id,
      unitInStock: Number(editStock[item.id]),
    })
  }
>
  Lưu
</Button>

                  </TableCell>

                  <TableCell align="center">{item.sold || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
