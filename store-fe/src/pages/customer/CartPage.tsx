import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  InputNumber, 
  Typography, 
  Empty, 
  Divider,
  message,
  Popconfirm
} from 'antd';
import { 
  DeleteOutlined, 
  ShoppingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const CartContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CartItemCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const PriceText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: #d4af37;
`;

const SummaryCard = styled(Card)`
  position: sticky;
  top: 24px;
`;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
              dispatch(updateQuantity({ itemId: productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    message.success('Item removed from cart');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    message.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    } else {
      message.warning('Your cart is empty');
    }
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0; // Free shipping over certain amount
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <CartContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Empty
            image={<ShoppingOutlined style={{ fontSize: '64px', color: '#d4af37' }} />}
            description="Your cart is empty"
          >
            <Button type="primary" onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </Empty>
        </div>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={{ marginBottom: '16px' }}
        >
          Continue Shopping
        </Button>
        <Title level={2}>Shopping Cart ({items.length} items)</Title>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {items.map((item) => (
            <CartItemCard key={item.id}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={4}>
                  <ProductImage src={item.image_url} alt={item.name} />
                </Col>
                <Col xs={24} sm={8}>
                  <Title level={5}>{item.name}</Title>
                  <Text type="secondary">Premium Quality</Text>
                </Col>
                <Col xs={12} sm={4}>
                  <PriceText>₹{item.price}</PriceText>
                </Col>
                <Col xs={12} sm={4}>
                  <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value || 1)}
                    style={{ width: '80px' }}
                  />
                </Col>
                <Col xs={12} sm={2}>
                  <PriceText>₹{item.price * item.quantity}</PriceText>
                </Col>
                <Col xs={12} sm={2}>
                  <Popconfirm
                    title="Remove this item?"
                    onConfirm={() => handleRemoveItem(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </Col>
              </Row>
            </CartItemCard>
          ))}

          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <Popconfirm
              title="Clear all items?"
              onConfirm={handleClearCart}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Clear Cart</Button>
            </Popconfirm>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <SummaryCard>
            <Title level={3}>Order Summary</Title>
            <Divider />
            
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Subtotal ({items.length} items):</Text>
              <Text>₹{subtotal}</Text>
            </Row>
            
            <Row justify="space-between" style={{ marginBottom: '8px' }}>
              <Text>Shipping:</Text>
              <Text>{shipping === 0 ? 'Free' : `₹${shipping}`}</Text>
            </Row>
            
            <Divider />
            
            <Row justify="space-between" style={{ marginBottom: '16px' }}>
              <Text strong style={{ fontSize: '18px' }}>Total:</Text>
              <PriceText>₹{total}</PriceText>
            </Row>
            
            <Button 
              type="primary" 
              size="large" 
              block
              onClick={handleCheckout}
              icon={<ShoppingOutlined />}
            >
              Proceed to Checkout
            </Button>
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Text type="secondary">
                Secure checkout with SSL encryption
              </Text>
            </div>
          </SummaryCard>
        </Col>
      </Row>
    </CartContainer>
  );
};

export default CartPage;
