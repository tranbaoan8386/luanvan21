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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import userApi from "../../../../apis/user";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const headCells = [
  {
    id: "st",
    numeric: false,
    disablePadding: true,
    label: "STT"
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Tên khách hàng"
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email"
  },
  {
    id: "verified",
    numeric: true,
    disablePadding: false,
    label: "Trạng thái"
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

function EnhancedTableToolbar({ search, onSearchChange }) {
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
          placeholder="Tìm kiếm người dùng"
          size="medium"
          sx={{ width: "450px" }}
          value={search}
          onChange={onSearchChange}
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

export default function ManagerUser() {
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");

  const queryClient = useQueryClient();

  const { data: usersData, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return userApi.getAll();
    },
    keepPreviousData: true
  });

  const deleteUser = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onError: (error) => {
      // Check if the error is related to foreign key constraints
      if (error.response?.data?.message) {
        toast.error(` ${error.response.data.message}`);
      }
      queryClient.invalidateQueries(["users"]);
    },
    onSuccess: () => {
      toast.success("Xóa thành công user");
      queryClient.invalidateQueries(["users"]);
    }
  });

  const toggleUserActive = useMutation({
    mutationFn: (id) => userApi.toggleActive(id),
    onSuccess: () => {  
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  });

  const handleDelete = (id) => {
    deleteUser.mutate(id);
    refetch();
  };

  const handleToggleActive = (id) => {
    toggleUserActive.mutate(id);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const users = usersData?.data.users;
  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  console.log("users", usersData);
  return (
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
          Quản lý người dùng
        </Typography>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          search={search}
          onSearchChange={handleSearchChange}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead />
            <TableBody>
              {filteredUsers &&
                filteredUsers.map((user, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={user.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{user.name}</TableCell>
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">
                        {user.isActive ? (
                          <Button color="success">Đã kích hoạt</Button>
                        ) : (
                          <Button color="warning">Chưa kích hoạt</Button>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {/* <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                          sx={{ mr: 1 }}
                        >
                          Xoá
                        </Button> */}
                        <Button
                          variant="outlined"
                          color={user.isActive ? "error" : "success"}
                          onClick={() => handleToggleActive(user.id)}
                        >
                          {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
