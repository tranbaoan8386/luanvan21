import { useContext, useEffect } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { IoMdPaperPlane } from "react-icons/io";
import { NAV } from "../../../constants/config";
import { usePathname } from "../../../hooks/usePathname";
import { useResponsive } from "../../../hooks/useResponsive";
import { Link } from "react-router-dom";
import ScrollBar from "../ScrollBar";
import { AppContext } from "../../../contexts/App";
import { MdDashboard, MdCategory, MdDiscount, MdPeople, MdShoppingCart } from "react-icons/md";
import { FaShirt } from "react-icons/fa6";
import { GiLargeDress } from "react-icons/gi";

const navConfig = [
  {
    title: "Tổng quan",
    path: "/admin",
    icon: <MdDashboard />
  },
  {
    title: "Quản lý sản phẩm",
    path: "/admin/product",
    icon: <FaShirt />
  },
  {
    title: "Quản lý danh mục",
    path: "/admin/category",
    icon: <MdCategory />
  },
  {
    title: "Quản lý thương hiệu",
    path: "/admin/brand",
    icon: <GiLargeDress />
  },
  {
    title: "Quản lý màu",
    path: "/admin/color",
    icon: <GiLargeDress />
  },
  {
    title: "Quản lý size",
    path: "/admin/size",
    icon: <GiLargeDress />
  },
  {
    title: "Quản lý đơn hàng",
    path: "/admin/order",
    icon: <MdShoppingCart />
  },
  {
    title: "Quản lý người dùng",
    path: "/admin/users",
    icon: <MdPeople />
  },
  {
    title: "Quản lý mã khuyến mãi",
    path: "/admin/coupon",
    icon: <MdDiscount />
  }
];


export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { profile } = useContext(AppContext);
  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12)
      }}
    >
      <Avatar src={null} alt="photoURL" />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{profile?.name}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 1 }}>
          {profile?.role?.name}
          <Link to="/">
            <IoMdPaperPlane fontSize="20px" />
          </Link>
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <ScrollBar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px"
        }}
      >
        <img
          src="https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg"
          width="200"
          height="60px"
        />
      </Link>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </ScrollBar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH }
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;

  return (
    <Link to={item.path}>
      <ListItemButton
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: "body2",
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: "fontWeightMedium",
          ...(active && {
            color: "primary.main",
            fontWeight: "fontWeightSemiBold",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16)
            }
          })
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box component="span">{item.title}</Box>
      </ListItemButton>
    </Link>
  );
}
