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
} from '@mui/material';
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
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";



interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  showBanner?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, showBanner = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [bannerVisible, setBannerVisible] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [offersMenuOpen, setOffersMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setBannerVisible(window.scrollY <= 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const shopCategories = [
    { name: 'Anklets', path: '/shop/anklets' },
    { name: 'Bangles', path: '/shop/bangles' },
    { name: 'Bracelets', path: '/shop/bracelets' },
    { name: 'Combos', path: '/shop/combos' },
    { name: 'Ear Studs', path: '/shop/ear-studs' },
    { name: 'Earrings', path: '/shop/earrings' },
    { name: 'Hoops', path: '/shop/hoops' },
    { name: 'Pendants', path: '/shop/pendants' },
    { name: 'Rings', path: '/shop/rings' },
    { name: 'Wall Frame Designs', path: '/shop/wall-frames' },
  ];

  const offers = [
    { name: 'Under 299', path: '/offers/under-299' },
    { name: 'Special Deals', path: '/offers/special-deals' },
    { name: 'Deal of the Month', path: '/offers/deal-of-month' },
  ];

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
    >
      <Box sx={{ width: 280, pt: 2 }}>
        <List>
          <ListItem button component={Link} to="/" onClick={() => setMobileDrawerOpen(false)}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          
          <ListItem button component={Link} to="/shop" onClick={() => setMobileDrawerOpen(false)}>
            <ListItemIcon><Store /></ListItemIcon>
            <ListItemText primary="All Products" />
          </ListItem>
          
          <ListItem button onClick={() => setShopMenuOpen(!shopMenuOpen)}>
            <ListItemIcon><Store /></ListItemIcon>
            <ListItemText primary="Categories" />
            {shopMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={shopMenuOpen}>
            <List component="div" disablePadding>
              {shopCategories.map((category) => (
                <ListItem
                  key={category.path}
                  button
                  component={Link}
                  to={category.path}
                  sx={{ pl: 4 }}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          
          <ListItem button onClick={() => setOffersMenuOpen(!offersMenuOpen)}>
            <ListItemIcon><CardGiftcard /></ListItemIcon>
            <ListItemText primary="Special Offers" />
            {offersMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={offersMenuOpen}>
            <List component="div" disablePadding>
              {offers.map((offer) => (
                <ListItem
                  key={offer.path}
                  button
                  component={Link}
                  to={offer.path}
                  sx={{ pl: 4 }}
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <ListItemText primary={offer.name} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          
          <ListItem button component={Link} to="/shop/hair-accessories" onClick={() => setMobileDrawerOpen(false)}>
            <ListItemText primary="Hair Accessories" />
          </ListItem>
          
          <ListItem button component={Link} to="/contact" onClick={() => setMobileDrawerOpen(false)}>
            <ListItemIcon><Phone /></ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItem>
          
          <ListItem button component={Link} to="/about" onClick={() => setMobileDrawerOpen(false)}>
            <ListItemIcon><Info /></ListItemIcon>
            <ListItemText primary="About Us" />
          </ListItem>
          
          {isAuthenticated && (
            <ListItem button component={Link} to="/profile" onClick={() => setMobileDrawerOpen(false)}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Profile" />
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
            position: 'fixed',
            top: bannerVisible ? 0 : '-40px',
            left: 0,
            right: 0,
            zIndex: 1101,
            textAlign: 'center',
            p: 1,
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            transition: 'top 0.3s ease',
            background: 'linear-gradient(135deg, #d4af37, #b8860b)',
            color: '#000',
          }}
        >
          <span style={{ fontSize: '16px' }}>🚚</span>
          FREE SHIPPING ON ALL ORDERS ABOVE PKR 2999/-
        </Box>
      )}

      {/* Main Header */}
      <AppBar
        position="fixed"
        sx={{
          top: showBanner && bannerVisible ? '32px' : '0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: { xs: '60px', md: '70px' },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Typography
            variant="h4"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              textDecoration: 'none',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: { xs: '1.5rem', md: '2rem' },
              '&:hover': {
                transform: 'scale(1.05) translateY(-1px)',
              },
            }}
          >
            Gem-Heart
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button color="inherit" component={Link} to="/" startIcon={<Home />}>
                Home
              </Button>
              <Button color="inherit" component={Link} to="/shop" startIcon={<Store />}>
                All Products
              </Button>
              <Button color="inherit" component={Link} to="/offers/under-299" startIcon={<CardGiftcard />}>
                Offers
              </Button>
              <Button color="inherit" component={Link} to="/shop/hair-accessories">Hair Accessories</Button>
              <Button color="inherit" component={Link} to="/contact" startIcon={<Phone />}>
                Contact
              </Button>
              <Button color="inherit" component={Link} to="/about" startIcon={<Info />}>
                About
              </Button>
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleTheme} color="primary">
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={itemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <Person />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                >
                  <MenuItem onClick={() => { navigate('/profile'); setUserMenuAnchor(null); }}>
                    <Person sx={{ mr: 1 }} /> Profile Settings
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/my-orders'); setUserMenuAnchor(null); }}>
                    My Orders
                  </MenuItem>
                  {user?.is_admin && (
                    <MenuItem onClick={() => { navigate('/admin'); setUserMenuAnchor(null); }}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { handleLogout(); setUserMenuAnchor(null); }}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="contained" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </Box>
            )}

            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileDrawerOpen(true)}
              >
                <MenuIcon />
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
