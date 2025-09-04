import React, { useState, useEffect } from "react";
import axios from "axios";
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
  useTheme,
  ThemeProvider,
  createTheme,
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
  LightMode,
  DarkMode,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const drawerWidth = { xs: 240, sm: 280 };
const collapsedWidth = { xs: 56, sm: 64 };

// Define color scheme from the header
const headerColors = {
  light: {
    background: "#F8FAFC",
    text: "#1E1B4B",
    accent: "#1E1B4B",
    buttonText: "#F8FAFC",
    bannerBg: "#000000",
    bannerText: "#FFFFFF",
  },
  dark: {
    background: "#1E1B4B",
    text: "#F8FAFC",
    accent: "#F8FAFC",
    buttonText: "#1E1B4B",
    bannerBg: "#000000",
    bannerText: "#FFFFFF",
  },
};

// Create custom themes based on header colors
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1E1B4B", // Navy blue from header
      contrastText: "#F8FAFC",
    },
    secondary: {
      main: "#2d2a6b", // Lighter navy blue
      contrastText: "#F8FAFC",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E1B4B",
      secondary: "#4B5563",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1E1B4B", // Navy blue for light theme sidebar
          color: "#F8FAFC",
          "& .MuiListItemButton-root": {
            color: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#FFFFFF",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2d2a6b", // Lighter navy blue for dark theme
      contrastText: "#F8FAFC",
    },
    secondary: {
      main: "#3d3a8b", // Even lighter blue for dark theme
      contrastText: "#F8FAFC",
    },
    background: {
      default: "#0F172A",
      paper: "#1E293B",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0F172A", // Darker blue for dark theme sidebar
          color: "#F8FAFC",
          "& .MuiListItemButton-root": {
            color: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#FFFFFF",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              },
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("admin-theme") === "dark";
  });

  // Update theme in localStorage and trigger theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Create a theme instance based on the current mode
  const adminTheme = createTheme(isDarkMode ? darkTheme : lightTheme);

  // User data state
  const [user, setUser] = useState<{
    full_name: string;
    profile_image?: string;
    role?: string;
  }>({
    full_name: "Loading...",
    role: "Administrator",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.data) {
          setUser({
            full_name:
              response.data.full_name || response.data.email || "Admin User",
            profile_image: response.data.profile_image,
            role: response.data.role || "Administrator",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Fallback to default values
        setUser({
          full_name: "Admin User",
          role: "Administrator",
        });
      }
    };

    fetchUserData();
  }, []);

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

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const pathParts = path.split("/").filter(Boolean);

    // Skip the first 'admin' part for cleaner breadcrumbs
    const relevantParts = pathParts.slice(1);

    if (relevantParts.length === 0) {
      return [
        <Typography
          key="dashboard"
          color="text.primary"
          sx={{ fontSize: "0.9rem", fontWeight: 600 }}
        >
          Dashboard
        </Typography>,
      ];
    }

    return relevantParts.map((part, index) => {
      const routeTo = `/${pathParts.slice(0, index + 2).join("/")}`;
      const isLast = index === relevantParts.length - 1;
      const label =
        part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " ");

      if (isLast) {
        return (
          <Typography
            key={part}
            color="text.primary"
            sx={{ fontSize: "0.9rem", fontWeight: 600 }}
          >
            {label}
          </Typography>
        );
      }

      return (
        <MuiLink
          key={part}
          component="button"
          onClick={() => navigate(routeTo)}
          underline="hover"
          sx={{
            color: "text.secondary",
            fontSize: "0.9rem",
            fontWeight: 500,
            "&:hover": {
              color: "primary.main",
              cursor: "pointer",
            },
          }}
        >
          {label}
        </MuiLink>
      );
    });
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar - Always navy blue */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            width: collapsed ? collapsedWidth.sm : drawerWidth.sm,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed ? collapsedWidth.sm : drawerWidth.sm,
              boxSizing: "border-box",
              borderRight: "none",
              transition: "width 0.3s ease, background-color 0.3s ease",
              overflowX: "hidden",
            },
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                m: 0,
                fontSize: collapsed ? "1.5rem" : "1.75rem",
                background: `linear-gradient(135deg, #F8FAFC, #E2E8F0)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {collapsed ? "G" : "Gem-Heart"}
            </Typography>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  opacity: 0.8,
                  display: "block",
                  mt: 0.5,
                  color: "#E2E8F0",
                }}
              >
                Admin Panel
              </Typography>
            )}
          </Box>

          {/* Menu Items */}
          <List sx={{ pt: 2, flexGrow: 1 }}>
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
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
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

          {/* Collapse Button at Bottom */}
          <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {collapsed ? <MenuIcon /> : <ChevronLeft />}
            </IconButton>
          </Box>
        </Drawer>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth.xs,
              boxSizing: "border-box",
              borderRight: "none",
              backgroundColor: "#1E1B4B",
            },
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                m: 0,
                fontSize: collapsed ? "1.5rem" : "1.75rem",
                background: `linear-gradient(135deg, #F8FAFC, #E2E8F0)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {collapsed ? "G" : "Gem-Heart"}
            </Typography>
            {!collapsed && (
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  opacity: 0.8,
                  display: "block",
                  mt: 0.5,
                  color: "#E2E8F0",
                }}
              >
                Admin Panel
              </Typography>
            )}
          </Box>

          {/* Menu Items */}
          <List sx={{ pt: 2, flexGrow: 1 }}>
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
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
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

          {/* Collapse Button at Bottom */}
          <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <IconButton
              onClick={() => setCollapsed(true)}
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.default",
          }}
        >
          {/* Header */}
          <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Toolbar
              sx={{
                justifyContent: "space-between",
                gap: 2,
                minHeight: { xs: "56px !important", sm: "72px !important" },
                px: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => setCollapsed(!collapsed)}
                  sx={{ mr: 1, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Admin Dashboard
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Theme Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.5, sm: 1 },
                  }}
                >
                  <IconButton
                    onClick={toggleTheme}
                    sx={{
                      color: theme.palette.text.primary,
                      bgcolor: theme.palette.primary.main,
                      "&:hover": {
                        bgcolor: isDarkMode ? "#E2E8F0" : "#2d2a6b",
                      },
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                    }}
                  >
                    {isDarkMode ? (
                      <LightMode
                        sx={{
                          color: theme.palette.primary.contrastText,
                          fontSize: { xs: "18px", sm: "24px" },
                        }}
                      />
                    ) : (
                      <DarkMode
                        sx={{
                          color: theme.palette.primary.contrastText,
                          fontSize: { xs: "18px", sm: "24px" },
                        }}
                      />
                    )}
                  </IconButton>
                </Box>

                {/* User Menu */}
                <Box
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    p: 1,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  }}
                >
                  <Avatar
                    src={user?.profile_image || ""}
                    alt={user?.full_name || "Admin"}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: user?.profile_image
                        ? "transparent"
                        : "primary.main",
                      color: user?.profile_image
                        ? "inherit"
                        : "primary.contrastText",
                      fontSize: "1rem",
                      fontWeight: 600,
                      border: "1px solid",
                      borderColor: "divider",
                      "& .MuiAvatar-img": {
                        objectFit: "cover",
                      },
                    }}
                  >
                    {!user?.profile_image &&
                      (user?.full_name?.charAt(0) || "A")}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {user?.full_name || "Admin"}
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                      Admin Panel
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
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
              bgcolor: "background.default",
              overflow: "auto",
              maxHeight: "calc(100vh - 128px)",
            }}
          >
            {/* Breadcrumbs */}
            <Box sx={{ px: { xs: 1.5, sm: 3 }, pt: 2, pb: 1 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <MuiLink
                  component="button"
                  onClick={() => navigate("/admin")}
                  underline="hover"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": {
                      color: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                >
                  Admin
                </MuiLink>
                {getBreadcrumbItems()}
              </Breadcrumbs>
            </Box>

            <Box
              sx={{
                pt: 1,
                minHeight: "100%",
                overflowX: "auto",
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
