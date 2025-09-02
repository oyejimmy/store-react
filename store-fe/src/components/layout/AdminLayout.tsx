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
  Switch,
  FormControlLabel,
} from "@mui/material";
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
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

// Brand colors
const brandColors = {
  primary: "#1E1B4B", // Deep navy blue
  secondary: "#94A3B8", // Silver
  background: "#F8FAFC", // Off-white
  backgroundDark: "#0F172A", // Dark background for the dark theme
  text: "#1E1B4B", // Default text color, deep navy
  textLight: "#FFFFFF", // White text for dark backgrounds or primary buttons
};

// Admin Light Theme
export const adminLightTheme = {
  palette: {
    mode: "light",
    primary: {
      main: brandColors.primary,
      light: "#4C4A73",
      dark: "#141238",
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: "#CBD5E1",
      dark: "#64748B",
      contrastText: brandColors.text,
    },
    background: {
      default: brandColors.background,
      paper: "#FFFFFF",
    },
    text: {
      primary: brandColors.text,
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          borderBottom: `1px solid ${brandColors.secondary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          boxShadow: "0 4px 12px rgba(30, 27, 75, 0.3)",
          "&:hover": {
            backgroundColor: "#141238",
            boxShadow: "0 6px 16px rgba(30, 27, 75, 0.4)",
          },
        },
      },
    },
  },
};

// Admin Dark Theme
export const adminDarkTheme = {
  palette: {
    mode: "dark",
    primary: {
      main: brandColors.secondary,
      light: "#CBD5E1",
      dark: "#64748B",
      contrastText: brandColors.primary,
    },
    secondary: {
      main: brandColors.primary,
      light: "#4C4A73",
      dark: "#141238",
      contrastText: brandColors.textLight,
    },
    background: {
      default: brandColors.backgroundDark,
      paper: "#1E293B",
    },
    text: {
      primary: "#E2E8F0",
      secondary: brandColors.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          borderBottom: `1px solid ${brandColors.secondary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: brandColors.secondary,
          color: brandColors.primary,
          boxShadow: "0 4px 12px rgba(148, 163, 184, 0.3)",
          "&:hover": {
            backgroundColor: "#CBD5E1",
            boxShadow: "0 6px 16px rgba(148, 163, 184, 0.4)",
          },
        },
      },
    },
  },
};

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

  // Mock user data
  const [user] = useState({ full_name: "Admin" });

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("admin-theme", newMode ? "dark" : "light");
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

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    const item = menuItems.find((item) => item.path === path);
    return item ? item.label : "Dashboard";
  };

  // Create theme based on current mode
  const theme = isDarkMode ? adminDarkTheme : adminLightTheme;

  return (
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
            backgroundColor: theme.palette.primary.main,
            borderRight: `2px solid ${theme.palette.secondary.main}`,
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            backgroundColor: theme.palette.secondary.main,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.contrastText,
              fontWeight: 800,
              m: 0,
              fontSize: collapsed ? "1.5rem" : "1.75rem",
            }}
          >
            {collapsed ? "G" : "Gem-Heart"}
          </Typography>
          {!collapsed && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.primary.contrastText,
                fontWeight: 600,
                opacity: 0.9,
                display: "block",
                mt: 0.5,
              }}
            >
              Admin Panel
            </Typography>
          )}
        </Box>

        {/* Menu Items */}
        <List sx={{ pt: 1, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  color: theme.palette.primary.contrastText,
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    transform: "translateX(4px)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            // borderBottom: `1px solid ${
            //   theme.palette.divider || "rgba(0, 0, 0, 0.12)"
            // }`,
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
            {/* Theme Toggle in Sidebar */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => setCollapsed(!collapsed)}
                sx={{ color: theme.palette.text.primary }}
              >
                {collapsed ? <MenuIcon /> : <ChevronLeft />}
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Admin Dashboard
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Theme Toggle in Header for mobile */}
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: theme.palette.text.primary,
                  display: { xs: "flex", md: "none" },
                }}
              >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              {!collapsed && (
                <Box
                  sx={{
                    p: 2,
                    borderTop: `1px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        icon={
                          <Brightness7
                            sx={{ color: theme.palette.primary.contrastText }}
                          />
                        }
                        checkedIcon={
                          <Brightness4
                            sx={{ color: theme.palette.primary.contrastText }}
                          />
                        }
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.primary.contrastText }}
                      >
                        {isDarkMode ? "Dark" : "Light"} Mode
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
              )}

              <Box
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 2,
                  background:
                    theme.palette.mode === "light"
                      ? "rgba(148, 163, 184, 0.1)"
                      : "rgba(30, 27, 75, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background:
                      theme.palette.mode === "light"
                        ? "rgba(148, 163, 184, 0.2)"
                        : "rgba(30, 27, 75, 0.2)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                  }}
                >
                  {user?.full_name?.charAt(0) || "A"}
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: theme.palette.text.primary }}
                  >
                    {user?.full_name || "Admin"}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Administrator
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={() => setUserMenuAnchor(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/admin/profile");
                  setUserMenuAnchor(null);
                }}
              >
                <Person sx={{ mr: 1, fontSize: 20 }} /> Profile Settings
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleLogout();
                  setUserMenuAnchor(null);
                }}
                sx={{ color: "error.main" }}
              >
                <Logout sx={{ mr: 1, fontSize: 20 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: theme.palette.background.default,
            overflow: "auto",
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ p: 3, minHeight: "100%" }}>
            <Breadcrumbs sx={{ mb: 3 }}>
              <MuiLink
                component="button"
                onClick={() => navigate("/admin")}
                underline="hover"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "0.9rem",
                }}
              >
                Admin
              </MuiLink>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {getBreadcrumbTitle()}
              </Typography>
            </Breadcrumbs>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
