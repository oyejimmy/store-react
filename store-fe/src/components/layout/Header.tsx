import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Logout,
  Menu as MenuIcon,
  Home,
  Store,
  CardGiftcard,
  Phone,
  Info,
  LightMode,
  DarkMode,
  ExpandLess,
  ExpandMore,
  Diamond,
  LocalOffer,
  MonetizationOn,
  CropLandscape,
  Favorite,
  Watch,
  Link,
  AutoAwesome,
  Hearing,
  Lens,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";

interface HeaderProps {
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  showBanner?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode = false,
  toggleTheme,
  showBanner = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(isAuthenticated, user);
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [bannerVisible, setBannerVisible] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [shopMenuAnchor, setShopMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [offersMenuAnchor, setOffersMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [shopMobileMenuOpen, setShopMobileMenuOpen] = useState(false);
  const [offersMobileMenuOpen, setOffersMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setBannerVisible(window.scrollY <= 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const shopCategories = [
    { name: "Anklets", path: "/shop/anklets", icon: <Favorite /> },
    { name: "Bangles", path: "/shop/bangles", icon: <Watch /> },
    { name: "Bracelets", path: "/shop/bracelets", icon: <Link /> },
    { name: "Combos", path: "/shop/combos", icon: <AutoAwesome /> },
    { name: "Ear Studs", path: "/shop/ear-studs", icon: <Hearing /> },
    { name: "Earrings", path: "/shop/earrings", icon: <Diamond /> },
    { name: "Hoops", path: "/shop/hoops", icon: <Lens /> },
    { name: "Pendants", path: "/shop/pendants", icon: <Favorite /> },
    { name: "Rings", path: "/shop/rings", icon: <Diamond /> },
    { name: "Wall frames", path: "/shop/wall-frames", icon: <CropLandscape /> },
    {
      name: "Hair Accessories",
      path: "/shop/hair-accessories",
      icon: <Store />,
    },
    { name: "All Products", path: "/shop", icon: <Store /> },
  ];

  const offers = [
    { name: "Under 299", path: "/offers/under-299", icon: <MonetizationOn /> },
    {
      name: "Special Deals",
      path: "/offers/special-deals",
      icon: <LocalOffer />,
    },
    {
      name: "Deal of Month",
      path: "/offers/deal-of-month",
      icon: <CardGiftcard />,
    },
  ];

  // Colors for light and dark modes
  const lightColors = {
    background: "#F8FAFC",
    text: "#1E1B4B",
    accent: "#1E1B4B",
    buttonText: "#F8FAFC",
    bannerBg: "#000000",
    bannerText: "#FFFFFF",
  };

  const darkColors = {
    background: "#1E1B4B",
    text: "#F8FAFC",
    accent: "#F8FAFC",
    buttonText: "#1E1B4B",
    bannerBg: "#000000",
    bannerText: "#FFFFFF",
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
    >
      <Box
        sx={{ width: 280, pt: 2, bgcolor: colors.background, height: "100%" }}
      >
        <List>
          <ListItem
            button
            component={RouterLink}
            to="/"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <ListItemIcon>
              <Home sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ color: colors.text }} />
          </ListItem>

          <ListItem
            button
            onClick={() => setShopMobileMenuOpen(!shopMobileMenuOpen)}
          >
            <ListItemIcon>
              <Store sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText primary="Shop" sx={{ color: colors.text }} />
            {shopMobileMenuOpen ? (
              <ExpandLess sx={{ color: colors.text }} />
            ) : (
              <ExpandMore sx={{ color: colors.text }} />
            )}
          </ListItem>
          <Collapse in={shopMobileMenuOpen}>
            <List component="div" disablePadding>
              {shopCategories.map((category) => (
                <ListItem
                  key={category.path}
                  button
                  component={RouterLink}
                  to={category.path}
                  sx={{ pl: 4 }}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(category.icon, {
                      sx: { color: colors.text, fontSize: "1.25rem" },
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    sx={{ color: colors.text }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItem
            button
            onClick={() => setOffersMobileMenuOpen(!offersMobileMenuOpen)}
          >
            <ListItemIcon>
              <CardGiftcard sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText
              primary="Special Offers"
              sx={{ color: colors.text }}
            />
            {offersMobileMenuOpen ? (
              <ExpandLess sx={{ color: colors.text }} />
            ) : (
              <ExpandMore sx={{ color: colors.text }} />
            )}
          </ListItem>
          <Collapse in={offersMobileMenuOpen}>
            <List component="div" disablePadding>
              {offers.map((offer) => (
                <ListItem
                  key={offer.path}
                  button
                  component={RouterLink}
                  to={offer.path}
                  sx={{ pl: 4 }}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {React.cloneElement(offer.icon, {
                      sx: { color: colors.text, fontSize: "1.25rem" },
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={offer.name}
                    sx={{ color: colors.text }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItem
            button
            component={RouterLink}
            to="/contact"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <ListItemIcon>
              <Phone sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText primary="Contact" sx={{ color: colors.text }} />
          </ListItem>

          <ListItem
            button
            component={RouterLink}
            to="/about"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <ListItemIcon>
              <Info sx={{ color: colors.text }} />
            </ListItemIcon>
            <ListItemText primary="About Us" sx={{ color: colors.text }} />
          </ListItem>

          {isAuthenticated && (
            <ListItem
              button
              component={RouterLink}
              to="/profile"
              onClick={() => setMobileDrawerOpen(false)}
            >
              <ListItemIcon>
                <Person sx={{ color: colors.text }} />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={{ color: colors.text }} />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      {/* Top Banner */}
      {showBanner && (
        <Box
          sx={{
            position: "fixed",
            top: bannerVisible ? 0 : "-40px",
            left: 0,
            right: 0,
            zIndex: 1101,
            textAlign: "center",
            p: 1,
            fontSize: isSmallMobile ? "12px" : "14px",
            fontWeight: 600,
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isSmallMobile ? "5.8px" : "3.5px",
            gap: 1,
            transition: "top 0.3s ease",
            background: colors.bannerBg,
            color: colors.bannerText,
          }}
        >
          <span style={{ fontSize: isSmallMobile ? "14px" : "16px" }}>🚚</span>
          FREE SHIPPING ON ALL ORDERS ABOVE PKR 2999/-
        </Box>
      )}

      {/* Main Header */}
      <AppBar
        position="fixed"
        sx={{
          top: showBanner && bannerVisible ? "32px" : "0",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: { xs: "60px", md: "70px" },
          bgcolor: colors.background,
          color: colors.text,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, sm: 2, md: 4 },
            minHeight: { xs: "60px", md: "70px" },
          }}
        >
          {/* Logo */}
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 800,
              textDecoration: "none",
              background: isDarkMode
                ? `linear-gradient(135deg, #F8FAFC, #E2E8F0)`
                : `linear-gradient(135deg, #1E1B4B, #2d2a6b)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              "&:hover": {
                transform: "scale(1.05) translateY(-1px)",
              },
            }}
          >
            Gem-Heart
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/"
                startIcon={
                  <Home sx={{ color: colors.text, fontSize: "20px" }} />
                }
                sx={{
                  color: colors.text,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                Home
              </Button>

              <Button
                color="inherit"
                onClick={(e) => setShopMenuAnchor(e.currentTarget)}
                startIcon={
                  <Store sx={{ color: colors.text, fontSize: "20px" }} />
                }
                endIcon={shopMenuAnchor ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  color: colors.text,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                Shop
              </Button>
              <Menu
                anchorEl={shopMenuAnchor}
                open={Boolean(shopMenuAnchor)}
                onClose={() => setShopMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    bgcolor: colors.background,
                    color: colors.text,
                    maxHeight: 400,
                    overflow: "auto",
                  },
                }}
              >
                {shopCategories.map((category) => (
                  <MenuItem
                    key={category.path}
                    onClick={() => {
                      navigate(category.path);
                      setShopMenuAnchor(null);
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(category.icon, {
                        sx: { color: colors.text },
                      })}
                    </ListItemIcon>
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="inherit"
                onClick={(e) => setOffersMenuAnchor(e.currentTarget)}
                startIcon={
                  <CardGiftcard sx={{ color: colors.text, fontSize: "20px" }} />
                }
                endIcon={offersMenuAnchor ? <ExpandLess /> : <ExpandMore />}
                sx={{
                  color: colors.text,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                Offers
              </Button>
              <Menu
                anchorEl={offersMenuAnchor}
                open={Boolean(offersMenuAnchor)}
                onClose={() => setOffersMenuAnchor(null)}
                PaperProps={{
                  sx: {
                    bgcolor: colors.background,
                    color: colors.text,
                  },
                }}
              >
                {offers.map((offer) => (
                  <MenuItem
                    key={offer.path}
                    onClick={() => {
                      navigate(offer.path);
                      setOffersMenuAnchor(null);
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(offer.icon, {
                        sx: { color: colors.text },
                      })}
                    </ListItemIcon>
                    <ListItemText primary={offer.name} />
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="inherit"
                component={RouterLink}
                to="/contact"
                startIcon={
                  <Phone sx={{ color: colors.text, fontSize: "20px" }} />
                }
                sx={{
                  color: colors.text,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                Contact
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/about"
                startIcon={
                  <Info sx={{ color: colors.text, fontSize: "20px" }} />
                }
                sx={{
                  color: colors.text,
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  px: 1,
                }}
              >
                About
              </Button>
            </Box>
          )}

          {/* Right Section */}
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
                color: colors.text,
                bgcolor: colors.accent,
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
                    color: colors.buttonText,
                    fontSize: { xs: "18px", sm: "24px" },
                  }}
                />
              ) : (
                <DarkMode
                  sx={{
                    color: colors.buttonText,
                    fontSize: { xs: "18px", sm: "24px" },
                  }}
                />
              )}
            </IconButton>

            <IconButton
              component={RouterLink}
              to="/cart"
              sx={{
                color: colors.text,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              <Badge
                badgeContent={itemCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: colors.accent,
                    color: colors.buttonText,
                    fontSize: { xs: "0.6rem", sm: "0.75rem" },
                    height: { xs: 16, sm: 20 },
                    minWidth: { xs: 16, sm: 20 },
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{
                    color: colors.text,
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 24, sm: 32 },
                      height: { xs: 24, sm: 32 },
                      bgcolor: colors.accent,
                      color: colors.buttonText,
                      fontSize: { xs: "0.75rem", sm: "1rem" },
                    }}
                  >
                    {user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <Person />
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  PaperProps={{
                    sx: {
                      bgcolor: colors.background,
                      color: colors.text,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setUserMenuAnchor(null);
                    }}
                  >
                    <Person sx={{ mr: 1, color: colors.text }} /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/my-orders");
                      setUserMenuAnchor(null);
                    }}
                  >
                    My Orders
                  </MenuItem>
                  {user?.is_admin && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        setUserMenuAnchor(null);
                      }}
                    >
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      setUserMenuAnchor(null);
                    }}
                  >
                    <Logout sx={{ mr: 1, color: colors.text }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: colors.text,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: "auto",
                    px: { xs: 0.5, sm: 1 },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signup")}
                  sx={{
                    bgcolor: colors.accent,
                    color: colors.buttonText,
                    "&:hover": {
                      bgcolor: isDarkMode ? "#E2E8F0" : "#2d2a6b",
                    },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    minWidth: "auto",
                    px: { xs: 0.5, sm: 1 },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}

            {isMobile && (
              <IconButton
                sx={{
                  color: colors.text,
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                }}
                onClick={() => setMobileDrawerOpen(true)}
              >
                <MenuIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileDrawer()}
    </>
  );
};

export default Header;
