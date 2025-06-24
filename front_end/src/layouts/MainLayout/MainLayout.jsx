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
        minHeight: "100vh", // ✅ quan trọng: để children (Cart) co giãn đúng
      }}
    >
      <Header />

      {/* Nội dung trang chiếm toàn bộ không gian còn lại */}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
