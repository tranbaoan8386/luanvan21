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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import userApi from "../../../../apis/user";
import { toast } from "react-toastify";

const headCells = [
  { id: "stt", label: "STT", width: "10%" },
  { id: "name", label: "Tên khách hàng", width: "25%" },
  { id: "email", label: "Email", width: "30%" },
  { id: "verified", label: "Trạng thái", width: "15%" },
  { id: "action", label: "Hành động", width: "20%" },
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
          placeholder="Tìm kiếm người dùng"
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

export default function ManagerUser() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getAll(),
    keepPreviousData: true,
  });

  const toggleUserActive = useMutation({
    mutationFn: (id) => userApi.toggleActive(id),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleToggleActive = (id) => {
    toggleUserActive.mutate(id);
  };

  const filteredUsers = usersData?.data?.users?.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

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
          Quản lý người dùng
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
        <EnhancedTableToolbar search={search} setSearch={setSearch} />

        <TableContainer sx={{ maxHeight: 520, borderRadius: 2, overflow: "auto" }}>
          <Table stickyHeader aria-label="users table" size="medium">
            <EnhancedTableHead />
            <TableBody>
              {filteredUsers?.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell align="left" sx={{ fontWeight: 600 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{user.name}</TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="outlined"
                        color={user.isActive ? "success" : "warning"}
                        size="small"
                      >
                        {user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                      </Button>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="outlined"
                        color={user.isActive ? "error" : "success"}
                        size="small"
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    Không tìm thấy người dùng phù hợp
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
