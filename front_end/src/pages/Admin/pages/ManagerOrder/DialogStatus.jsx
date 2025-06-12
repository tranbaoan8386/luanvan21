import { GrUpdate } from "react-icons/gr";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { green } from "@mui/material/colors";
import * as React from "react";
import {
  convertUpdateStatusOrder // Chỉ dùng để hiển thị
} from "../../../../common";

// Dữ liệu lưu trong hệ thống (tiếng Anh)
const statusList = ["shipped", "delivered", "cancelled"];

export default function DialogStatus({ onClose, selectedValue, open }) {
  const handleClose = () => {
    onClose(selectedValue); // trả về giá trị tiếng Anh
  };

  const handleListItemClick = (value) => {
    onClose(value); // value = "shipped" v.v.
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
      <List sx={{ pt: 0 }}>
        {statusList.map((status) => (
          <ListItem disableGutters key={status}>
            <ListItemButton onClick={() => handleListItemClick(status)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                  <GrUpdate />
                </Avatar>
              </ListItemAvatar>
              {/* Hiển thị tiếng Việt tương ứng */}
              <ListItemText primary={convertUpdateStatusOrder(status)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
