import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUserOrders } from "../../store/slices/orderSlice";
import { Card, Typography, Tag, Button, Table, Empty, Spin } from "antd";
import { EyeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title, Text } = Typography;

const OrdersContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const UserOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_number",
      key: "order_number",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => <Text strong>₹{amount}</Text>,
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
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/order/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <OrdersContainer>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>
          <ShoppingOutlined style={{ marginRight: "8px" }} />
          My Orders
        </Title>
        <Text type="secondary">Track your order history and status</Text>
      </div>

      {orders.length === 0 ? (
        <Empty description="No orders found" style={{ marginTop: "50px" }}>
          <Button type="primary" onClick={() => navigate("/shop")}>
            Start Shopping
          </Button>
        </Empty>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      )}
    </OrdersContainer>
  );
};

export default UserOrdersPage;
