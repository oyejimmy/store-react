import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  GiftOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined,
  GlobalOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  
  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  * {
    box-sizing: border-box;
  }
`;

const StyledHeader = styled(Header)`
  background: linear-gradient(135deg, #d4af37, #b8860b) !important;
  padding: 0 24px !important;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 2px solid #b8860b !important;
  height: 64px !important;
  line-height: 64px !important;
`;

const StyledSider = styled(Sider)`
  background: linear-gradient(180deg, #1a1a1a, #2a2a2a) !important;
  border-right: 2px solid #d4af37 !important;
  
  .ant-layout-sider-trigger {
    background: #d4af37 !important;
    color: #000 !important;
  }
  
  .ant-menu {
    background: transparent !important;
    border: none !important;
  }
  
  .ant-menu-item {
    color: rgba(255, 255, 255, 0.8) !important;
    margin: 4px 8px !important;
    border-radius: 8px !important;
    
    &:hover {
      background: linear-gradient(135deg, #d4af37, #b8860b) !important;
      color: #000 !important;
      transform: translateX(4px) !important;
      transition: all 0.3s ease !important;
    }
    
    &.ant-menu-item-selected {
      background: linear-gradient(135deg, #d4af37, #b8860b) !important;
      color: #000 !important;
      font-weight: 600 !important;
    }
  }
`;

const StyledContent = styled(Content)`
  background: #f5f5f5;
  overflow: auto;
  position: relative;
`;

const UserDropdown = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/admin/inventory',
      icon: <BarChartOutlined />,
      label: 'Inventory',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: '/admin/offers',
      icon: <GiftOutlined />,
      label: 'Offers',
    },
    {
      key: '/admin/payments',
      icon: <CreditCardOutlined />,
      label: 'Payments',
    },
    {
      key: '/admin/sales-channels',
      icon: <GlobalOutlined />,
      label: 'Sales Channels',
    },
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };



  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0, 
      padding: 0, 
      background: '#f5f5f5'
    }}>
    <StyledLayout style={{ height: '100vh' }}>
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ 
          padding: '20px 16px', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #d4af37, #b8860b)',
          borderBottom: '2px solid #b8860b'
        }}>
          <Title level={4} style={{ color: '#000', margin: 0, fontWeight: 800 }}>
            {collapsed ? 'S' : 'Saiyaara'}
          </Title>
          {!collapsed && (
            <div style={{ color: '#000', fontSize: '12px', fontWeight: 600, opacity: 0.8 }}>Admin Panel</div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </StyledSider>
      
      <Layout>
        <StyledHeader>
          <Logo>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: '18px', 
                color: '#000',
                marginRight: '16px'
              }}
            />
            <Title level={3} style={{ color: '#000', margin: 0, fontWeight: 800 }}>
              Admin Dashboard
            </Title>
          </Logo>
          
          <Dropdown 
            menu={{ 
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Profile Settings',
                },
                {
                  type: 'divider',
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  danger: true,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') {
                  handleLogout();
                }
              }
            }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ background: '#000', color: '#d4af37' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>{user?.full_name || 'Admin'}</div>
                <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.7)' }}>Administrator</div>
              </div>
            </div>
          </Dropdown>
        </StyledHeader>
        
        <StyledContent>
          <div style={{ padding: '16px 24px 0 24px' }}>
            <Breadcrumb
              style={{ marginBottom: '16px' }}
              items={[
                {
                  title: 'Admin',
                  href: '/admin',
                },
                {
                  title: (() => {
                    const path = location.pathname;
                    if (path === '/admin') return 'Dashboard';
                    if (path === '/admin/products') return 'Products';
                    if (path === '/admin/orders') return 'Orders';
                    if (path === '/admin/inventory') return 'Inventory';
                    if (path === '/admin/users') return 'Users';
                    if (path === '/admin/offers') return 'Offers';
                    if (path === '/admin/payments') return 'Payments';
                    if (path === '/admin/sales-channels') return 'Sales Channels';
                    if (path === '/admin/reports') return 'Reports';
                    return 'Dashboard';
                  })(),
                },
              ]}
            />
          </div>
          
          <Outlet />
        </StyledContent>
      </Layout>
    </StyledLayout>
    </div>
  );
};

export default AdminLayout;