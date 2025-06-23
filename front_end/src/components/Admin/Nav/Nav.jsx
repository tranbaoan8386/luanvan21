import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IoMdPaperPlane } from "react-icons/io";
import { MdDashboard, MdCategory, MdDiscount, MdPeople, MdShoppingCart } from "react-icons/md";
import { FaShirt } from "react-icons/fa6";
import { GiLargeDress } from "react-icons/gi";
import { FiLogOut } from "react-icons/fi"; // 🔐 icon logout

import ScrollBar from "../ScrollBar";
import { NAV } from "../../../constants/config";
import { usePathname } from "../../../hooks/usePathname";
import { useResponsive } from "../../../hooks/useResponsive";
import { AppContext } from "../../../contexts/App";

// 🎨 Màu sắc
const COLORS = {
  sidebarBg: "#f9f5f1",
  hoverBg: "#f1eae4",
  active: "#a47148",
  text: "#3e2c23",
  divider: "#e0d7ce",
};

const navConfig = [
  { title: "Tổng quan", 
    path: "/admin", 
    icon: <MdDashboard /> 
  },
  { title: "Quản lý danh mục", 
    path: "/admin/category", 
    icon: <MdCategory /> 
  },
  { title: "Quản lý sản phẩm", 
    path: "/admin/product", 
    icon: <FaShirt /> 
  },
  { title: "Quản lý thương hiệu", 
    path: "/admin/brand", 
    icon: <GiLargeDress /> 
  },
  { title: "Quản lý màu", 
    path: "/admin/color", 
    icon: <GiLargeDress /> 
  },
  { title: "Quản lý size", 
    path: "/admin/size", 
    icon: <GiLargeDress /> 
  },
  { title: "Quản lý đơn hàng", 
    path: "/admin/order", 
    icon: <MdShoppingCart /> 
  },
  { title: "Quản lý người dùng", 
    path: "/admin/users", 
    icon: <MdPeople /> 
  },
  { title: "Quản lý mã khuyến mãi", 
    path: "/admin/coupon", 
    icon: <MdDiscount /> 
  },
];

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { profile, logout } = useContext(AppContext); // ✅ thêm logout
  const navigate = useNavigate();
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
        mx: 2,
        py: 2,
        px: 2.5,
        display: "flex",
        alignItems: "center",
        borderRadius: 2,
        bgcolor: COLORS.hoverBg,
        color: COLORS.text,
        boxShadow: 1,
      }}
    >
      <Avatar
        src={profile?.avatar || ""}
        alt="avatar"
        sx={{ width: 48, height: 48, border: "2px solid white" }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {profile?.name || "Admin"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13 }}>
          <Typography variant="body2">{profile?.role?.name || "Vai trò"}</Typography>
          <Link to="/" style={{ color: COLORS.active }}>
            <IoMdPaperPlane fontSize="18px" />
          </Link>
        </Box>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.8} sx={{ px: 2, mt: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderLogout = (
    <ListItemButton
      onClick={() => {
        logout();
        navigate("/login");
      }}
      sx={{
        m: 2,
        borderRadius: 1.5,
        typography: "body2",
        fontWeight: 500,
        color: COLORS.text,
        "&:hover": {
          bgcolor: COLORS.hoverBg,
          color: COLORS.active,
        },
      }}
    >
      <Box
        component="span"
        sx={{
          width: 24,
          height: 24,
          mr: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FiLogOut />
      </Box>
      <Box component="span">Đăng xuất</Box>
    </ListItemButton>
  );

  const renderContent = (
    <ScrollBar
      sx={{
        flexGrow: 1,
        overflowY: "auto", 
        maxHeight: "100vh",
        "& .simplebar-content": {
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
        },
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "16px",
        }}
      >
        <img
          src="https://insacmau.com/wp-content/uploads/2024/11/logo-shop-quan-ao-nam-1.jpg"
          width="100"
          height="auto"
          style={{ borderRadius: 8, objectFit: "cover", transition: "0.3s", cursor: "pointer" }}
        />
      </Link>
  
      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
      {renderLogout}
    </ScrollBar>
  );
  
  
  

  return (
    <Box sx={{ flexShrink: { lg: 0 }, width: { lg: NAV.WIDTH } }}>
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            bgcolor: COLORS.sidebarBg,
            color: COLORS.text,
            borderRight: `1px solid ${COLORS.divider}`,
            boxShadow: 4,
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
              width: NAV.WIDTH,
              bgcolor: COLORS.sidebarBg,
              color: COLORS.text,
            },
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
    <Link to={item.path} style={{ textDecoration: "none" }}>
      <ListItemButton
        sx={{
          minHeight: 48,
          borderRadius: 1.5,
          typography: "body2",
          color: active ? COLORS.active : COLORS.text,
          fontWeight: active ? "fontWeightSemiBold" : "fontWeightRegular",
          bgcolor: active ? COLORS.hoverBg : "transparent",
          transition: "all 0.3s",
          "&:hover": {
            bgcolor: COLORS.hoverBg,
            color: COLORS.active,
          },
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.icon}
        </Box>
        <Box component="span">{item.title}</Box>
      </ListItemButton>
    </Link>
  );
}
