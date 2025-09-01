import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  ThemeProvider,
} from "@mui/material";
import { adminLightTheme, adminDarkTheme } from "../../admin-theme";
import {
  Dashboard,
  ShoppingBag,
  Person,
  ShoppingCart,
  BarChart,
  CardGiftcard,
  Logout,
  Menu as MenuIcon,
  ChevronLeft,
  CreditCard,
  Public,
  Description,
  Collections,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { RootState } from "../../store";

const drawerWidth = 280;
const collapsedWidth = 64;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const toggleAdminTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("admin-theme", !isDarkMode ? "dark" : "light");
  };

  const menuItems = [
    { path: "/admin", icon: <Dashboard />, label: "Dashboard" },
    { path: "/admin/products", icon: <ShoppingBag />, label: "Products" },
    { path: "/admin/collections", icon: <Collections />, label: "Collections" },
    { path: "/admin/inventory", icon: <BarChart />, label: "Inventory" },
    { path: "/admin/orders", icon: <ShoppingCart />, label: "Orders" },
    { path: "/admin/users", icon: <Person />, label: "Users" },
    { path: "/admin/offers", icon: <CardGiftcard />, label: "Offers" },
    { path: "/admin/payments", icon: <CreditCard />, label: "Payments" },
    {
      path: "/admin/sales-channels",
      icon: <Public />,
      label: "Sales Channels",
    },
    { path: "/admin/reports", icon: <Description />, label: "Reports" },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/products") return "Products";
    if (path === "/admin/collections") return "Collections";
    if (path === "/admin/orders") return "Orders";
    if (path === "/admin/inventory") return "Inventory";
    if (path === "/admin/users") return "Users";
    if (path === "/admin/offers") return "Offers";
    if (path === "/admin/payments") return "Payments";
    if (path === "/admin/sales-channels") return "Sales Channels";
    if (path === "/admin/reports") return "Reports";
    return "Dashboard";
  };

  return (
    <ThemeProvider theme={isDarkMode ? adminDarkTheme : adminLightTheme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? collapsedWidth : drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? collapsedWidth : drawerWidth,
              boxSizing: "border-box",
              background: "linear-gradient(180deg, #1e293b, #334155)",
              borderRight: "2px solid #6366f1",
              transition: "width 0.3s ease",
            },
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              borderBottom: "2px solid #4f46e5",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#fff", fontWeight: 800, m: 0 }}
            >
              {collapsed ? "G" : "Gem-Heart"}
            </Typography>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{ color: "#fff", fontWeight: 600, opacity: 0.9 }}
              >
                Admin Panel
              </Typography>
            )}
          </Box>

          {/* Menu Items */}
          <List sx={{ pt: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    color: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff",
                      transform: "translateX(4px)",
                    },
                    "&.Mui-selected": {
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff",
                      fontWeight: 600,
                      "&:hover": {
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: "inherit", minWidth: collapsed ? 0 : 40 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <AppBar
            position="static"
            sx={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              borderBottom: "2px solid #4f46e5",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={() => setCollapsed(!collapsed)}
                  sx={{ color: "#fff" }}
                >
                  {collapsed ? <MenuIcon /> : <ChevronLeft />}
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{ color: "#fff", fontWeight: 800 }}
                >
                  Admin Dashboard
                </Typography>
              </Box>

              <Box
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": { background: "rgba(0,0,0,0.2)" },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    color: "#6366f1",
                    width: 32,
                    height: 32,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#fff" }}
                  >
                    {user?.full_name || "Admin"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    Administrator
                  </Typography>
                </Box>
              </Box>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={() => setUserMenuAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/admin/profile");
                    setUserMenuAnchor(null);
                  }}
                >
                  <Person sx={{ mr: 1 }} /> Profile Settings
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    setUserMenuAnchor(null);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          {/* Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "#f8fafc",
              overflow: "auto",
              maxHeight: "calc(100vh - 64px)",
            }}
          >
            <Box sx={{ p: 3, minHeight: "100%" }}>
              <Breadcrumbs sx={{ mb: 2 }}>
                <MuiLink
                  component="button"
                  onClick={() => navigate("/admin")}
                  underline="hover"
                >
                  Admin
                </MuiLink>
                <Typography color="text.primary">
                  {getBreadcrumbTitle()}
                </Typography>
              </Breadcrumbs>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
