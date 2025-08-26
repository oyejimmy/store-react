import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Tag,
  Progress,
  Spin,
  message,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { adminAPI } from "../../services/api";
import styled from "styled-components";


const { Title, Text } = Typography;

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const StatCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  
  .ant-card-body {
    padding: 20px;
  }
`;

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders()
      ]);
      
      // Calculate low stock items (stock < 10)
      const lowStock = products.filter((product: any) => 
        (product.stock_quantity || product.stock || 0) < 10
      ).map((product: any) => ({
        id: product.id,
        name: product.name,
        stock: product.stock_quantity || product.stock || 0,
        threshold: 10
      }));
      
      setLowStockItems(lowStock);
      // Sort orders by creation date and get latest 3
      const sortedOrders = orders.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 3));
      
      // Calculate category statistics
      const categories = ['Anklets', 'Bangles', 'Bracelets', 'Combos', 'Ear Studs', 'Earrings', 'Hoops', 'Pendants', 'Rings', 'Wall Frame Design', 'Hair Accessories'];
      const categoryData = categories.map(category => {
        const categoryProducts = products.filter((product: any) => 
          product.subcategory?.toLowerCase().includes(category.toLowerCase()) ||
          product.category?.toLowerCase().includes(category.toLowerCase())
        );
        return {
          category,
          totalProducts: categoryProducts.length,
          totalStock: categoryProducts.reduce((sum: number, product: any) => sum + (product.stock_quantity || product.stock || 0), 0),
          totalSold: categoryProducts.reduce((sum: number, product: any) => sum + (product.sold || 0), 0)
        };
      });
      setCategoryStats(categoryData);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0),
        totalCustomers: new Set(orders.map((order: any) => order.customer_email)).size,
        lowStockProducts: lowStock.length,
        pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
      });
    } catch (error) {
      message.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      default:
        return "default";
    }
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => `PKR ${amount || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase() || 'PENDING'}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <EyeOutlined style={{ color: "#1890ff", cursor: "pointer" }} />
      ),
    },
  ];

  const stockColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Current Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock === 0 ? 'red' : stock < 5 ? 'orange' : 'green'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: "Stock Level",
      key: "stockLevel",
      render: (_: any, record: any) => (
        <Progress
          percent={Math.round((record.stock / record.threshold) * 100)}
          size="small"
          status={record.stock === 0 ? "exception" : record.stock < 5 ? "active" : "normal"}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Title level={2} style={{ color: '#d4af37', marginBottom: '24px' }}>Admin Dashboard</Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="PKR"
              valueStyle={{ color: "#d4af37" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </StatCard>
        </Col>
      </Row>

      {/* Alerts */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <StatCard>
            <Title level={4}>
              <RiseOutlined style={{ marginRight: "8px" }} />
              Low Stock Alerts
            </Title>
            <Text type="secondary">
              {stats.lowStockProducts} products need restocking
            </Text>
            <Table
              columns={stockColumns}
              dataSource={lowStockItems}
              pagination={false}
              size="small"
              style={{ marginTop: "16px" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} lg={12}>
          <StatCard>
            <Title level={4}>
              <ShoppingOutlined style={{ marginRight: "8px" }} />
              Pending Orders
            </Title>
            <Text type="secondary">
              {stats.pendingOrders} orders awaiting processing
            </Text>
            <div style={{ marginTop: "16px" }}>
              <Progress
                percent={Math.round(
                  (stats.pendingOrders / stats.totalOrders) * 100
                )}
                status="active"
              />
            </div>
          </StatCard>
        </Col>
      </Row>

      {/* Category Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <StatCard>
            <Title level={4}>📊 Category Statistics</Title>
            <Table
              columns={[
                {
                  title: 'Category',
                  dataIndex: 'category',
                  key: 'category',
                  render: (category: string) => (
                    <Tag color="gold">{category}</Tag>
                  ),
                },
                {
                  title: 'Total Products',
                  dataIndex: 'totalProducts',
                  key: 'totalProducts',
                },
                {
                  title: 'Stock Available',
                  dataIndex: 'totalStock',
                  key: 'totalStock',
                  render: (stock: number) => (
                    <Tag color={stock > 50 ? 'green' : stock > 20 ? 'orange' : 'red'}>
                      {stock}
                    </Tag>
                  ),
                },
                {
                  title: 'Total Sold',
                  dataIndex: 'totalSold',
                  key: 'totalSold',
                  render: (sold: number) => (
                    <Tag color="blue">{sold}</Tag>
                  ),
                },
              ]}
              dataSource={categoryStats}
              pagination={false}
              size="small"
              rowKey="category"
            />
          </StatCard>
        </Col>
      </Row>

      {/* Recent Orders */}
      <StatCard>
        <Title level={4}>Recent Orders</Title>
        <Table
          columns={orderColumns}
          dataSource={recentOrders}
          pagination={false}
          size="small"
        />
      </StatCard>
    </DashboardContainer>
  );
};

export default AdminDashboard;
