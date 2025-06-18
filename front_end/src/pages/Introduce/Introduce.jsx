import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AiOutlineShopping } from "react-icons/ai";
import './Introduce.css';

export default function Introduce() {
  return (
    <Container className="intro-container">
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography className="intro-title">
            🧥 Cửa hàng Áo Khoác Store
          </Typography>
        </Grid>

        <Grid item>
          <Typography className="intro-highlight">
            Áo Khoác Store - Sản phẩm chất lượng, dịch vụ hoàn hảo, xu hướng thời trang mới mẻ và tinh tế!
          </Typography>
        </Grid>

        <Grid item>
          <Typography className="intro-section">
            <strong>Áo Khoác Store</strong> là cửa hàng thời trang cung cấp các sản phẩm chất lượng bao gồm:
            <br />– Thời trang nam
            <br />– Thời trang nữ
            <br />– Các phụ kiện thời trang
          </Typography>
        </Grid>

        <Grid item>
          <Typography className="intro-note">
            🛍️ An tâm mua sắm tại Áo Khoác Store
          </Typography>
          <Typography className="intro-section">
            Khách hàng ghé thăm chúng tôi có thể hoàn toàn an tâm bởi giá trị và chất lượng sản phẩm mà chúng tôi cung cấp. Không chỉ đẹp, độc, lạ – mà còn bền và chỉn chu đến từng đường may.
          </Typography>
        </Grid>

        <Grid item>
          <Typography className="intro-highlight" sx={{ fontSize: 18 }}>
            Khi đến với Áo Khoác Store, bạn sẽ nhận được:
          </Typography>
          <List className="intro-list">
            {[
              "Chính sách bảo hành và đổi trả linh hoạt",
              "Đóng gói kỹ lưỡng khi vận chuyển xa",
              "Mẫu mã thiết kế độc đáo và đa dạng",
              "Tư vấn chi tiết về sản phẩm, màu sắc và kích thước"
            ].map((text, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}
