import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Introduce() {
  return (
    <>
      {/* Banner hình ảnh lớn */}
      <Container sx={{ mt: 2 }}>
  <Box
    sx={{
      backgroundImage: `url("https://maymacthuongtin.com/wp-content/uploads/2018/06/banner-ao-may-theo-mau.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: { xs: "200px", md: "400px" },
      borderRadius: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textShadow: "1px 1px 4px rgba(0,0,0,0.7)"
    }}
  >
    <Typography variant="h4" fontWeight="bold">
      🧥 Áo Khoác Store
    </Typography>
  </Box>
</Container>


      {/* Nội dung giới thiệu */}
      <Container sx={{ py: 5 }}>
        {/* Section 1 */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            🎯 Về Chúng Tôi
          </Typography>
          <Typography>
            <strong>Áo Khoác Store</strong> là cửa hàng chuyên cung cấp:
            <br />– Thời trang nam, nữ
            <br />– Các mẫu áo khoác hot trend
            <br />– Phụ kiện thời trang chất lượng
          </Typography>
        </Paper>

        {/* Section 2 */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src="https://hoangphuconline.vn/media/wysiwyg/_768x446_Cate_banner_Ao_khoac.png"
              alt="Store Info"
              style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight={600} mb={2}>
              🛍️ Tại sao chọn chúng tôi?
            </Typography>
            <List>
              {[
                "Chính sách đổi trả linh hoạt",
                "Đóng gói sản phẩm cẩn thận",
                "Thiết kế áo độc quyền, đa dạng",
                "Tư vấn nhanh chóng – nhiệt tình"
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
