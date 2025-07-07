import React from 'react';
import Header from '../../components/Header';
import Footer from "../../components/Footer/Footer";
import { Box } from "@mui/material";

export default function MainLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Chiều cao tối thiểu toàn màn hình
      }}
    >
      <Header />

      {/* Nội dung chính co giãn linh hoạt, không tạo khoảng trắng thừa */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "1px", // Ngăn flex auto kéo dài quá mức
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
