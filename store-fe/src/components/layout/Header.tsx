import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Badge, Dropdown, Avatar, Space } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
  ShopOutlined,
  GiftOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";

const { Header: AntHeader } = Layout;

const TopBanner = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: ${props => props.isVisible ? '0' : '-40px'};
  left: 0;
  right: 0;
  z-index: 1001;
  text-align: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: top 0.3s ease;
  
  .light-theme & {
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #000;
  }
  
  .dark-theme & {
    background: linear-gradient(135deg, #d4af37, #b8860b);
    color: #000;
  }
`;

const StyledHeader = styled(AntHeader)<{ bannerVisible: boolean }>`
  position: fixed;
  top: ${props => props.bannerVisible ? '32px' : '0'};
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  height: 70px;
  
  .light-theme & {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  }
  
  .dark-theme & {
    background: rgba(26, 26, 26, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 60px;
  }
`;

const Logo = styled(Link)`
  font-size: 32px;
  font-weight: 800;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.5px;
  position: relative;
  
  .light-theme & {
    background: linear-gradient(135deg, #d4af37, #b8860b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
  }
  
  .dark-theme & {
    background: linear-gradient(135deg, #d4af37, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.5));
  }

  &:hover {
    transform: scale(1.05) translateY(-1px);
    
    .light-theme & {
      filter: drop-shadow(0 4px 8px rgba(212, 175, 55, 0.4));
    }
    
    .dark-theme & {
      filter: drop-shadow(0 4px 12px rgba(212, 175, 55, 0.6));
    }
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const NavMenu = styled(Menu)`
  border: none;
  background: transparent;
  flex: 1;
  justify-content: center;
  font-weight: 500;

  .light-theme & {
    .ant-menu-item, .ant-menu-submenu-title {
      color: #333;
      border-radius: 8px;
      margin: 0 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.1);
        transform: translateY(-1px);
      }

      &.ant-menu-item-selected {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.15);
        border-bottom: 2px solid #d4af37;
      }
    }
  }
  
  .dark-theme & {
    .ant-menu-item, .ant-menu-submenu-title {
      color: #e0e0e0;
      border-radius: 8px;
      margin: 0 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.2);
        transform: translateY(-1px);
      }

      &.ant-menu-item-selected {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.25);
        border-bottom: 2px solid #d4af37;
      }
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  .ant-btn {
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  .light-theme & {
    .ant-btn-text {
      color: #333;
      
      &:hover {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.1);
      }
    }
    
    .ant-btn-primary {
      background: linear-gradient(135deg, #d4af37, #b8860b);
      border: none;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #b8860b, #996f0a);
        box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
      }
    }
  }
  
  .dark-theme & {
    .ant-btn-text {
      color: #e0e0e0;
      
      &:hover {
        color: #d4af37;
        background: rgba(212, 175, 55, 0.2);
      }
    }
    
    .ant-btn-primary {
      background: linear-gradient(135deg, #d4af37, #ffd700);
      border: none;
      color: #000;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
      
      &:hover {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        box-shadow: 0 6px 16px rgba(212, 175, 55, 0.5);
      }
    }
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopMenu = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { itemCount } = useSelector((state: RootState) => state.cart);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [bannerVisible, setBannerVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setBannerVisible(false);
      } else {
        setBannerVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ShopOutlined />,
      onClick: () => navigate("/my-orders"),
    },
    {
      key: "admin",
      label: "Admin Panel",
      icon: <UserOutlined />,
      onClick: () => navigate("/admin"),
      hidden: !user?.is_admin,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ].filter((item) => !item.hidden);

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "shop",
      label: "Shop",
      icon: <ShopOutlined />,
      children: [
        {
          key: "/shop/anklets",
          label: <Link to="/shop/anklets">Anklets</Link>,
        },
        {
          key: "/shop/bangles",
          label: <Link to="/shop/bangles">Bangles</Link>,
        },
        {
          key: "/shop/bracelets",
          label: <Link to="/shop/bracelets">Bracelets</Link>,
        },
        { key: "/shop/combos", label: <Link to="/shop/combos">Combos</Link> },
        {
          key: "/shop/ear-studs",
          label: <Link to="/shop/ear-studs">Ear Studs</Link>,
        },
        {
          key: "/shop/earrings",
          label: <Link to="/shop/earrings">Earrings</Link>,
        },
        { key: "/shop/hoops", label: <Link to="/shop/hoops">Hoops</Link> },
        {
          key: "/shop/pendants",
          label: <Link to="/shop/pendants">Pendants</Link>,
        },
        { key: "/shop/rings", label: <Link to="/shop/rings">Rings</Link> },
        {
          key: "/shop/wall-frames",
          label: <Link to="/shop/wall-frames">Wall Frame Designs</Link>,
        },
      ],
    },
    {
      key: "offers",
      label: "Special Offers",
      icon: <GiftOutlined />,
      children: [
        {
          key: "/offers/under-299",
          label: <Link to="/offers/under-299">Under 299</Link>,
        },
        {
          key: "/offers/special-deals",
          label: <Link to="/offers/special-deals">Special Deals</Link>,
        },
        {
          key: "/offers/deal-of-month",
          label: <Link to="/offers/deal-of-month">Deal of the Month</Link>,
        },
      ],
    },
    {
      key: "/shop/hair-accessories",
      label: <Link to="/shop/hair-accessories">Hair Accessories</Link>,
    },
    {
      key: "/contact",
      label: <Link to="/contact">Contact</Link>,
      icon: <PhoneOutlined />,
    },
    {
      key: "/about",
      label: <Link to="/about">About Us</Link>,
      icon: <InfoCircleOutlined />,
    },
  ];

  const selectedKeys = [location.pathname];

  return (
    <>
      <TopBanner isVisible={bannerVisible}>
        <span style={{ fontSize: '16px' }}>🚚</span>
        FREE SHIPPING ON ALL ORDERS ABOVE PKR 2999/-
      </TopBanner>
      <StyledHeader bannerVisible={bannerVisible}>
      <Logo to="/">Saiyaara</Logo>

      <DesktopMenu>
        <NavMenu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </DesktopMenu>

      <RightSection>
        <Button 
          type="text" 
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          style={{ 
            color: '#d4af37',
            fontSize: '18px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        
        <Link to="/cart">
          <Badge count={itemCount} size="small">
            <Button type="text" icon={<ShoppingCartOutlined />} size="large" />
          </Badge>
        </Link>

        {isAuthenticated ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.full_name || user?.username}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button type="primary" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Space>
        )}

        <MobileMenuButton
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
        />
      </RightSection>
      </StyledHeader>
    </>
  );
};

export default Header;
