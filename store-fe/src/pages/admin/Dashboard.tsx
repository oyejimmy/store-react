import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Tag,
  Progress,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Title, Text } = Typography;

const DashboardContainer = styled.div`
  padding: 24px;
`;

const StatCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AdminDashboard: React.FC = () => {
  // Mock data - in real app, this would come from API
  const stats = {
    totalProducts: 156,
    totalOrders: 89,
    totalRevenue: 125000,
    totalCustomers: 234,
    lowStockProducts: 12,
    pendingOrders: 15,
  };

  const recentOrders = [
    {
      id: 1,
      orderNumber: "ORD-001",
      customer: "John Doe",
      amount: 2500,
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      customer: "Jane Smith",
      amount: 1800,
      status: "processing",
      date: "2024-01-14",
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      customer: "Mike Johnson",
      amount: 3200,
      status: "shipped",
      date: "2024-01-13",
    },
  ];

  const lowStockItems = [
    { id: 1, name: "Gold Ring", stock: 2, threshold: 10 },
    { id: 2, name: "Silver Necklace", stock: 5, threshold: 10 },
    { id: 3, name: "Diamond Earrings", stock: 1, threshold: 10 },
  ];

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
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹${amount}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
    },
    {
      title: "Stock Level",
      key: "stockLevel",
      render: (_: any, record: any) => (
        <Progress
          percent={Math.round((record.stock / record.threshold) * 100)}
          size="small"
          status={record.stock < 5 ? "exception" : "normal"}
        />
      ),
    },
  ];

  return (
    <DashboardContainer>
      <Title level={2}>Admin Dashboard</Title>

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
              suffix="₹"
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
