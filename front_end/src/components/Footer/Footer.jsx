import {
    Box,
    Container,
    Grid,
    Typography,
    Link as MuiLink
  } from "@mui/material";
  import {
    FaFacebook,
    FaInstagram,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt
  } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";
  
  export default function Footer() {
    const navigate = useNavigate();
  
    const handleLogoClick = () => {
      navigate("/");
    };
  
    return (
      <Box
        sx={{ backgroundColor: "rgb(26, 148, 255)", color: "#fff", py: 5, mt: 10 }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ cursor: "pointer" }}
                onClick={handleLogoClick}
              >
                🧥 Áo Khoác Store
              </Typography>
              <Typography variant="body2">
                Chất lượng - Uy tín - Thời trang là sứ mệnh của chúng tôi.
              </Typography>
              
            </Grid>
  
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Liên hệ
              </Typography>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <FaMapMarkerAlt /> 180 Cao Lỗ, Phường 4, Quận 8, TP. Hồ Chí Minh
              </Typography>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <FaPhone /> 0971 244 694
              </Typography>
              <Typography
                variant="body2"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <FaEnvelope /> tranbaoan20102002@gmail.com
              </Typography>
            </Grid>
  
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Theo dõi chúng tôi
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <MuiLink href="https://facebook.com" color="inherit" target="_blank">
                  <FaFacebook size={20} />
                </MuiLink>
                <MuiLink href="https://instagram.com" color="inherit" target="_blank">
                  <FaInstagram size={20} />
                </MuiLink>
              </Box>
            </Grid>
          </Grid>
  
          <Box textAlign="center" mt={4} fontSize="14px">
            © {new Date().getFullYear()} Áo Khoác Store. All rights reserved.
          </Box>
        </Container>
      </Box>
    );
  }
  