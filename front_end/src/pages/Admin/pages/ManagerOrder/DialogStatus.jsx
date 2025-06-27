import { GrUpdate } from "react-icons/gr";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { green } from "@mui/material/colors";
import * as React from "react";
import {
  convertUpdateStatusOrder // Chỉ dùng để hiển thị
} from "../../../../common";

const statusList = ["shipped", "delivered", "cancelled"];

export default function DialogStatus({ onClose, selectedValue, open }) {
  const handleClose = () => {
    onClose(null); // Trả về null nếu nhấn nút đóng
  };

  const handleListItemClick = (value) => {
    onClose(value); // Trả về trạng thái được chọn
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ m: 0, p: 2, pr: 4 }}>
        Cập nhật trạng thái đơn hàng
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {statusList.map((status) => (
          <ListItem disableGutters key={status}>
            <ListItemButton onClick={() => handleListItemClick(status)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                  <GrUpdate />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={convertUpdateStatusOrder(status)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
