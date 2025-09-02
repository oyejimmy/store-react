import React from "react";
import { Card, Typography, Button, Row, Col, Divider, Steps } from "antd";
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const ConfirmationContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SuccessCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  // In a real app, you would get this from the order state or URL params
  const orderNumber =
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <ConfirmationContainer>
      <SuccessCard>
        <div style={{ marginBottom: "32px" }}>
          <CheckCircleOutlined
            style={{
              fontSize: "64px",
              color: "#52c41a",
              marginBottom: "16px",
            }}
          />
          <Title level={2} style={{ color: "#52c41a", marginBottom: "8px" }}>
            Order Confirmed!
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Thank you for your purchase. Your order has been successfully
            placed.
          </Text>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <Title level={4}>Order Details</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12}>
              <div style={{ textAlign: "left" }}>
                <Text strong>Order Number:</Text>
                <br />
                <Text style={{ fontSize: "18px", color: "#d4af37" }}>
                  {orderNumber}
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div style={{ textAlign: "left" }}>
                <Text strong>Order Date:</Text>
                <br />
                <Text>{new Date().toLocaleDateString()}</Text>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        <div style={{ marginBottom: "32px" }}>
          <Title level={4}>What&apos;s Next?</Title>
          <Steps
            direction="vertical"
            size="small"
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <Step
              title="Order Confirmed"
              description="Your order has been received and confirmed"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
            <Step
              title="Processing"
              description="We're preparing your order for shipment"
            />
            <Step
              title="Shipped"
              description="Your order is on its way to you"
            />
            <Step
              title="Delivered"
              description="Your order has been delivered"
            />
          </Steps>
        </div>

        <Divider />

        <div style={{ marginBottom: "24px" }}>
          <Title level={4}>Important Information</Title>
          <Paragraph
            style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
          >
            <ul style={{ lineHeight: "1.8" }}>
              <li>
                You will receive an email confirmation with your order details
              </li>
              <li>
                We&apos;ll send you tracking information once your order ships
              </li>
              <li>Estimated delivery time: 3-5 business days</li>
              <li>For any questions, please contact our customer support</li>
            </ul>
          </Paragraph>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
          <Button
            size="large"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/my-orders")}
          >
            View My Orders
          </Button>
        </div>
      </SuccessCard>
    </ConfirmationContainer>
  );
};

export default OrderConfirmationPage;
