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
  CheckCircleOutlined,
  MobileOutlined,
  WalletOutlined
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
  const [formData, setFormData] = useState<any>({});
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
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const processPayment = async (orderData: any, allData: any) => {
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      // Mobile wallet payment processing
      const paymentData = {
        amount: total,
        mobile_number: allData.mobile_number,
        cnic: allData.cnic,
        order_id: Date.now().toString(),
        gateway: paymentMethod,
        merchant_account: '03121999696' // SadaPay account
      };

      try {
        // Payment gateway API call
        const response = await fetch('/api/payments/mobile-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });
        
        if (response.ok) {
          const result = await response.json();
          message.success(`Payment of PKR ${total} initiated to 03121999696! Check your ${paymentMethod} app.`);
          return { success: true, transaction_id: result.transaction_id };
        } else {
          throw new Error('Payment failed');
        }
      } catch (error) {
        // Direct payment instruction
        const txnId = `TXN${Date.now()}`;
        message.success({
          content: `Send PKR ${total} to 03121999696 via ${paymentMethod.toUpperCase()}. Reference: ${txnId}`,
          duration: 10
        });
        return { success: true, transaction_id: txnId };
      }
    }
    return { success: true };
  };

  const handleSubmit = async (values: any) => {
    try {
      // Merge all form data
      const allData = { ...formData, ...values };
      
      // Combine name fields
      const customer_name = `${allData.first_name || ''} ${allData.last_name || ''}`.trim();
      
      // Combine address fields
      const addressParts = [
        allData.address_line1,
        allData.address_line2,
        allData.city,
        allData.state,
        allData.postal_code
      ].filter(Boolean);
      const shipping_address = addressParts.join(', ');

      const orderData: any = {
        customer_name,
        customer_email: allData.email,
        customer_phone: allData.phone,
        shipping_address,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Process payment if mobile wallet
      const paymentResult = await processPayment(orderData, allData);
      
      if (paymentResult.success) {
        // Add transaction details to order
        if (paymentResult.transaction_id) {
          orderData.transaction_id = paymentResult.transaction_id;
          orderData.payment_status = 'pending';
        }

        if (isAuthenticated) {
          await dispatch(createUserOrder(orderData)).unwrap();
        } else {
          await dispatch(createGuestOrder(orderData)).unwrap();
        }

        dispatch(clearCart());
        message.success('Order placed successfully!');
        navigate('/order-confirmation');
      }
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <WalletOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#52c41a' }} />
                          <div>
                            <Text strong>Cash on Delivery (COD)</Text>
                            <br />
                            <Text type="secondary">Pay when you receive your order</Text>
                          </div>
                        </div>
                      </Radio>
                      <Radio value="easypaisa" style={{ display: 'block', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <MobileOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#00a651' }} />
                          <div>
                            <Text strong>EasyPaisa</Text>
                            <br />
                            <Text type="secondary">Pay securely with EasyPaisa mobile wallet</Text>
                          </div>
                        </div>
                      </Radio>
                      <Radio value="jazzcash" style={{ display: 'block', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <MobileOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#ff6b35' }} />
                          <div>
                            <Text strong>JazzCash</Text>
                            <br />
                            <Text type="secondary">Pay securely with JazzCash mobile wallet</Text>
                          </div>
                        </div>
                      </Radio>
                      <Radio value="card" style={{ display: 'block' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <CreditCardOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#1890ff' }} />
                          <div>
                            <Text strong>Credit/Debit Card</Text>
                            <br />
                            <Text type="secondary">Secure payment with SSL encryption</Text>
                          </div>
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  
                  {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                    <div>
                      <Divider />
                      <Title level={5}>{paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Payment</Title>
                      <Form.Item
                        name="mobile_number"
                        label="Mobile Number"
                        rules={[
                          { required: true, message: 'Please enter your mobile number' },
                          { pattern: /^03[0-9]{9}$/, message: 'Please enter valid mobile number (03XXXXXXXXX)' }
                        ]}
                      >
                        <Input 
                          placeholder="03XXXXXXXXX" 
                          prefix={<MobileOutlined />}
                          maxLength={11}
                        />
                      </Form.Item>
                      <Form.Item
                        name="cnic"
                        label="CNIC (Last 4 digits)"
                        rules={[
                          { required: true, message: 'Please enter last 4 digits of CNIC' },
                          { pattern: /^[0-9]{4}$/, message: 'Please enter exactly 4 digits' }
                        ]}
                      >
                        <Input 
                          placeholder="1234" 
                          maxLength={4}
                        />
                      </Form.Item>
                      <div style={{ 
                        background: '#f6ffed', 
                        border: '1px solid #b7eb8f', 
                        borderRadius: '6px', 
                        padding: '12px',
                        marginTop: '16px'
                      }}>
                        <Text type="secondary">
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                          Payment will be sent to: <strong>03121999696 (SadaPay)</strong>
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          You will receive payment confirmation on your mobile number.
                        </Text>
                      </div>
                    </div>
                  )}

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
                  <PriceText>PKR {item.price * item.quantity}</PriceText>
                </Col>
              </Row>
            ))}
            
            <Divider />
            
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Subtotal:</Text>
              <Text>PKR {subtotal}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Shipping:</Text>
              <Text>PKR {shipping}</Text>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Text strong style={{ fontSize: '18px' }}>Total:</Text>
              <PriceText>PKR {total}</PriceText>
            </Row>
          </OrderSummaryCard>
        </Col>
      </Row>
    </CheckoutContainer>
  );
};

export default CheckoutPage;
