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
import { convertUpdateStatuspayment } from "../../../../common";
const statusPayment = ["paid"];

export default function DialogPayment({ onClose, currentStatus, open }) {
  const handleClosePayment = () => {
    onClose(currentStatus);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClosePayment} open={open}>
      <DialogTitle>Cập nhật trạng thái Thanh toán</DialogTitle>
      <List sx={{ pt: 0 }}>
        {statusPayment.map((st) => {
          return (
            <ListItem disableGutters key={st}>
              <ListItemButton onClick={() => handleListItemClick(st)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                    <GrUpdate />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={convertUpdateStatuspayment(st)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}
