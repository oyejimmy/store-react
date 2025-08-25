import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createGuestOrder, createUserOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  Radio,
  message,
  Steps,
  Select,
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  CreditCardOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const CheckoutContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const OrderSummaryCard = styled(Card)`
  position: sticky;
  top: 24px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const PriceText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: #d4af37;
`;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.orders);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form] = Form.useForm();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 50;
  const total = subtotal + shipping;

  const steps = [
    {
      title: 'Contact Info',
      icon: <UserOutlined />,
    },
    {
      title: 'Shipping',
      icon: <EnvironmentOutlined />,
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (values: any) => {
    try {
      const orderData = {
        ...values,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        payment_method: paymentMethod
      };

      if (isAuthenticated) {
        await dispatch(createUserOrder(orderData)).unwrap();
      } else {
        await dispatch(createGuestOrder(orderData)).unwrap();
      }

      dispatch(clearCart());
      message.success('Order placed successfully!');
      navigate('/order-confirmation');
    } catch (error) {
      message.error('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutContainer>
      <Title level={2}>Checkout</Title>
      
      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                email: user?.email || '',
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                phone: user?.phone || '',
                payment_method: 'cod'
              }}
            >
              {currentStep === 0 && (
                <div>
                  <Title level={4}>Contact Information</Title>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <Title level={4}>Shipping Address</Title>
                  <Form.Item
                    name="address_line1"
                    label="Address Line 1"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="address_line2"
                    label="Address Line 2 (Optional)"
                  >
                    <Input />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please enter your city' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="state"
                        label="State"
                        rules={[{ required: true, message: 'Please enter your state' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        name="postal_code"
                        label="Postal Code"
                        rules={[{ required: true, message: 'Please enter your postal code' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <Title level={4}>Payment Method</Title>
                  <Form.Item name="payment_method">
                    <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)}>
                      <Radio value="cod" style={{ display: 'block', marginBottom: '16px' }}>
                        <div>
                          <Text strong>Cash on Delivery (COD)</Text>
                          <br />
                          <Text type="secondary">Pay when you receive your order</Text>
                        </div>
                      </Radio>
                      <Radio value="card" style={{ display: 'block' }}>
                        <div>
                          <Text strong>Credit/Debit Card</Text>
                          <br />
                          <Text type="secondary">Secure payment with SSL encryption</Text>
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  {paymentMethod === 'card' && (
                    <div>
                      <Divider />
                      <Title level={5}>Card Details</Title>
                      <Form.Item
                        name="card_number"
                        label="Card Number"
                        rules={[{ required: true, message: 'Please enter card number' }]}
                      >
                        <Input placeholder="1234 5678 9012 3456" />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col xs={12}>
                          <Form.Item
                            name="expiry"
                            label="Expiry Date"
                            rules={[{ required: true, message: 'Please enter expiry date' }]}
                          >
                            <Input placeholder="MM/YY" />
                          </Form.Item>
                        </Col>
                        <Col xs={12}>
                          <Form.Item
                            name="cvv"
                            label="CVV"
                            rules={[{ required: true, message: 'Please enter CVV' }]}
                          >
                            <Input placeholder="123" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              )}

              <Divider />

              <div style={{ textAlign: 'right' }}>
                {currentStep > 0 && (
                  <Button style={{ marginRight: 8 }} onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={handleNext}>
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                  >
                    Place Order
                  </Button>
                )}
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <OrderSummaryCard>
            <Title level={4}>Order Summary</Title>
            <Divider />
            
            {items.map((item) => (
              <Row key={item.id} gutter={8} style={{ marginBottom: '12px' }}>
                <Col span={4}>
                  <ProductImage src={item.image_url} alt={item.name} />
                </Col>
                <Col span={12}>
                  <Text>{item.name}</Text>
                  <br />
                  <Text type="secondary">Qty: {item.quantity}</Text>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <PriceText>₹{item.price * item.quantity}</PriceText>
                </Col>
              </Row>
            ))}
            
            <Divider />
            
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Subtotal:</Text>
              <Text>₹{subtotal}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Shipping:</Text>
              <Text>₹{shipping}</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Text strong style={{ fontSize: '18px' }}>Total:</Text>
              <PriceText>₹{total}</PriceText>
            </Row>
          </OrderSummaryCard>
        </Col>
      </Row>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
