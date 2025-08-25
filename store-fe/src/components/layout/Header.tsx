import React, { useState } from "react";
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
} from "@ant-design/icons";
import styled from "styled-components";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";

const { Header: AntHeader } = Layout;

const StyledHeader = styled(AntHeader)`
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #d4af37;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    color: #b8860b;
  }
`;

const NavMenu = styled(Menu)`
  border: none;
  background: transparent;
  flex: 1;
  justify-content: center;

  .ant-menu-item {
    color: #333;

    &:hover {
      color: #d4af37;
    }

    &.ant-menu-item-selected {
      color: #d4af37;
      border-bottom-color: #d4af37;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
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
    <StyledHeader>
      <Logo to="/">Saiyaara</Logo>

      <DesktopMenu>
        <NavMenu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </DesktopMenu>

      <RightSection>
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
  );
};

export default Header;
