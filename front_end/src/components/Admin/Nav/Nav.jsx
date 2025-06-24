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
import { FiLogOut } from "react-icons/fi";

import ScrollBar from "../ScrollBar";
import { NAV } from "../../../constants/config";
import { usePathname } from "../../../hooks/usePathname";
import { useResponsive } from "../../../hooks/useResponsive";
import { AppContext } from "../../../contexts/App";

// Màu sắc
const COLORS = {
  sidebarBg: "#d9cbbf",       // nền sidebar đậm hơn (nâu nhạt hơn)
  hoverBg: "#c3b29e",         // nền hover đậm và ấm hơn
  active: "#7a4b1d",          // màu active nâu sẫm hơn, rõ ràng
  text: "#2b1f12",            // màu chữ nâu đen, đậm hơn
  divider: "#b49c7c",         // màu đường phân chia đậm hơn
  logoutBg: "#f9c1b7",        // nền logout đỏ nhạt đậm hơn chút
  logoutBorder: "#f4978e",    // viền logout đỏ đậm hơn
  logoutHoverBg: "#f07c70",   // hover logout đỏ đậm rõ hơn
  logoutIconColor: "#a4342a", // icon logout đỏ đậm hơn
};


const navConfig = [
  { title: "Tổng quan", path: "/admin", icon: <MdDashboard /> },
  { title: "Quản lý danh mục", path: "/admin/category", icon: <MdCategory /> },
  { title: "Quản lý sản phẩm", path: "/admin/product", icon: <FaShirt /> },
  { title: "Quản lý thương hiệu", path: "/admin/brand", icon: <GiLargeDress /> },
  { title: "Quản lý màu", path: "/admin/color", icon: <GiLargeDress /> },
  { title: "Quản lý size", path: "/admin/size", icon: <GiLargeDress /> },
  { title: "Quản lý đơn hàng", path: "/admin/order", icon: <MdShoppingCart /> },
  { title: "Quản lý người dùng", path: "/admin/users", icon: <MdPeople /> },
  { title: "Quản lý mã khuyến mãi", path: "/admin/coupon", icon: <MdDiscount /> },
];

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const { profile, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname, openNav, onCloseNav]);

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
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        userSelect: "none",
      }}
    >
      <Avatar
        src={profile?.avatar || ""}
        alt="avatar"
        sx={{ width: 48, height: 48, border: "2px solid white", boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {profile?.name || "Admin"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 13,
            color: COLORS.active,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {profile?.role?.name || "Vai trò"}
          </Typography>
          <Link to="/" style={{ color: COLORS.active, display: "flex", alignItems: "center" }}>
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
        backgroundColor: COLORS.logoutBg,
        border: `1px solid ${COLORS.logoutBorder}`,
        "&:hover": {
          bgcolor: COLORS.logoutHoverBg,
          color: COLORS.active,
          transform: "translateX(4px)",
          boxShadow: `2px 2px 8px rgba(164,113,72,0.3)`,
        },
        transition: "all 0.3s",
        userSelect: "none",
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
          color: COLORS.logoutIconColor,
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
      {/* <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
          marginBottom: 16,
          userSelect: "none",
        }}
      >
        <img
          src="https://insacmau.com/wp-content/uploads/2024/11/logo-shop-quan-ao-nam-1.jpg"
          width={100}
          height="auto"
          alt="Logo"
          style={{
            borderRadius: 8,
            objectFit: "cover",
            cursor: "pointer",
            transition: "transform 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          draggable={false}
        />
      </Link> */}

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
            boxShadow: "0 0 12px rgba(0,0,0,0.1)",
            zIndex: 1200,
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
          ModalProps={{
            keepMounted: true, // Improve mobile performance
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
    <Link to={item.path} style={{ textDecoration: "none" }} tabIndex={-1}>
      <ListItemButton
        sx={{
          minHeight: 48,
          borderRadius: 1.5,
          typography: "body2",
          color: active ? COLORS.active : COLORS.text,
          fontWeight: active ? 600 : 400,
          bgcolor: active ? COLORS.hoverBg : "transparent",
          transition: "all 0.3s",
          userSelect: "none",
          "&:hover": {
            bgcolor: COLORS.hoverBg,
            color: COLORS.active,
            transform: "translateX(6px)",
            boxShadow: `2px 2px 6px rgba(164,113,72,0.3)`,
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
            color: active ? COLORS.active : COLORS.text,
          }}
        >
          {item.icon}
        </Box>
        <Box component="span" sx={{ whiteSpace: "nowrap" }}>
          {item.title}
        </Box>
      </ListItemButton>
    </Link>
  );
}
