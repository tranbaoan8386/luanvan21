import { Box, Card, Container, Grid } from "@mui/material";
import React, { Fragment } from "react";
import GridProduct from "../../components/GridProduct";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import WrongLocationIcon from "@mui/icons-material/WrongLocation";
import { BsPersonX } from "react-icons/bs";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
export default function Introduce() {
  return (
    <Container sx={{ mt: 16 }}>
      <Grid>
        <h1 className="
title_page">
          Cửa hàng Đức Thoại Store
        </h1>

        <Box className="
content-page rte py-3">
          <Box
            paddingTop={3}
            sx={{
              fontWeight: "900",
              fontStyle: "normal",
              // fontStyle: "oblique",
              fontSize: "larger"
            }}
          >
            Đức Thoại Store - Sản phẩm chất lượng - dịch vụ hoàn hảo - xu hướng thời trang mới mẻ và tinh tế!
          </Box>
          <Box paddingTop={2} pb={3}>
            <strong
              sx={{
                fontWeight: "900",
                fontStyle: "normal",
                // fontStyle: "oblique",
                fontSize: "larger"
              }}
            >
              Đức Thoại Store là cửa hàng thời trang
            </strong>{" "}
            cung cấp các sản phẩm thời trang chất lượng bao gồm:&nbsp;Thời trang nam, Thời trang nữ 
            và&nbsp;Các phụ kiện thời trang.
          </Box>

          {/* <Box
            className="
youtube-embed-wrapper"
            sx={{ position: "relative", paddingBottom: "56.25%" }}
          >
            <iframe
              src="https://www.youtube.com/embed/_-6m8QAYhx8"
              width={1110}
              height={460}
            ></iframe>
          </Box> */}

          <Box
            sx={{
              paddingTop: "20px",
              fontWeight: "900",
              // fontStyle: "normal",
              fontStyle: "oblique",
              fontSize: "larger"
            }}
          >
            An tâm mua sắm đồ thời trang tại Đức Thoại Store
          </Box>
          <Box
            sx={{
              paddingTop: "10px"
            }}
          >
            Khách hàng ghé thăm Đức Thoại Store có thể hoàn toàn an tâm bởi các giá
            trị và chất lượng sản phẩm mà Đức Thoại Store đem lại. Tại đây, chúng
            tôi không chỉ cung cấp những sản phẩm có mẫu mã, kiểu dáng đẹp, độc,
            lạ mà còn chú ý lựa chọn các sản phẩm có chất lượng tốt, tỉ mỉ trong
            từng đường nét.
          </Box>
          <Box
            sx={{
              paddingTop: "10px"
            }}
          >
            Đến với cửa hàng thời trang Đức Thoại Store, các bạn sẽ:
          </Box>
          <Box
            sx={{
              paddingTop: "10px",
              fontWeight: "900",
              fontStyle: "normal",
              // fontStyle: "oblique",
              fontSize: "medium"
            }}
          >
            <Box>
              Đảm bảo chất lượng hàng hoá với các chính sách bảo hành và chính
              sách đổi hàng.
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                fontWeight: "900",
                fontStyle: "normal",
                // fontStyle: "oblique",
                fontSize: "larger"
              }}
            >
              An tâm đống gói khi vận chuyển xa.
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                fontWeight: "900",
                fontStyle: "normal",
                // fontStyle: "oblique",
                fontSize: "larger"
              }}
            >
              Mẫu mã thiết kế độc đáo.
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                fontWeight: "900",
                fontStyle: "normal",
                // fontStyle: "oblique",
                fontSize: "larger"
              }}
            >
              Tư vấn về sản phẩm, màu sắc, kích thước thích hợp với mọi người.
            </Box>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}
