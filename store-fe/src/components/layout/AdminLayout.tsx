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
  createTheme,
  CssBaseline
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
} from "@mui/icons-material";
import { BrowserRouter, useNavigate, useLocation, Outlet, Routes, Route } from "react-router-dom";

// Theming functions moved to this file to make it self-contained
const getAdminTheme = ({ primaryColor, secondaryColor, backgroundColor, fontFamily, mode }) => {
  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: backgroundColor,
      },
      text: {
        primary: mode === 'light' ? '#121212' : '#F8FAFC',
        secondary: mode === 'light' ? '#64748B' : '#94A3B8',
      },
    },
    typography: {
      fontFamily: fontFamily,
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
  });
};

export const adminLightTheme = getAdminTheme({
  primaryColor: '#1E1B4B', // Deep navy
  secondaryColor: '#94A3B8', // Silver accent
  backgroundColor: '#F8FAFC', // Off-white
  fontFamily: 'Inter',
  mode: 'light'
});

export const adminDarkTheme = getAdminTheme({
  primaryColor: '#94A3B8', // Silver accent
  secondaryColor: '#1E1B4B', // Deep navy
  backgroundColor: '#0F172A', // Dark background for contrast
  fontFamily: 'Inter',
  mode: 'dark'
});

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
  const theme = useTheme();

  // Mock user and logout functionality to resolve import errors
  const [user, setUser] = useState({ full_name: "Admin" });
  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

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

  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    const item = menuItems.find(item => item.path === path);
    return item ? item.label : "Dashboard";
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
              backgroundColor: theme.palette.primary.main,
              borderRight: `2px solid ${theme.palette.secondary.main}`,
              transition: "width 0.3s ease",
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
              sx={{ color: theme.palette.text.primary, fontWeight: 800, m: 0 }}
            >
              {collapsed ? "G" : "Gem-Heart"}
            </Typography>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, fontWeight: 600, opacity: 0.9 }}
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
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.text.primary,
                      transform: "translateX(4px)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
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
              backgroundColor: theme.palette.primary.main,
              boxShadow: `0 4px 12px ${theme.palette.primary.dark}30`,
              borderBottom: `2px solid ${theme.palette.secondary.main}`,
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={() => setCollapsed(!collapsed)}
                  sx={{ color: theme.palette.text.primary }}
                >
                  {collapsed ? <MenuIcon /> : <ChevronLeft />}
                </IconButton>
                <Typography
                  variant="h5"
                  sx={{ color: theme.palette.text.primary, fontWeight: 800 }}
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
                  background: theme.palette.mode === 'light' ? `rgba(148, 163, 184, 0.1)` : `rgba(30, 27, 75, 0.1)`,
                  transition: "all 0.3s ease",
                  "&:hover": { background: theme.palette.mode === 'light' ? `rgba(148, 163, 184, 0.2)` : `rgba(30, 27, 75, 0.2)` },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Person />
                </Avatar>
                <Box>
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
              bgcolor: theme.palette.background.default,
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
                  sx={{ color: theme.palette.text.primary }}
                >
                  Admin
                </MuiLink>
                <Typography sx={{ color: theme.palette.text.primary }}>
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

// A simple component to render in the Outlet
const DashboardPage = () => {
  return (
    <Box sx={{ p: 2, background: 'rgba(212, 175, 55, 0.1)', borderRadius: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Dashboard Content</Typography>
      <Typography variant="body1">
        Welcome to the admin dashboard. This is a placeholder for your main dashboard content.
      </Typography>
    </Box>
  );
};

// Main App component to handle routing
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });

  return (
    <ThemeProvider theme={isDarkMode ? adminDarkTheme : adminLightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Add more routes for other sections as needed */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
