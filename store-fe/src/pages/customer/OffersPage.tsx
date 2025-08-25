import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchOffersByType } from '../../store/slices/offerSlice';
import { Card, Row, Col, Typography, Tag, Button, Empty, Spin } from 'antd';
import { ShoppingCartOutlined, FireOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

const OffersContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const OfferCard = styled(Card)`
  margin-bottom: 16px;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #d4af37;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  margin-right: 8px;
`;

const DiscountTag = styled(Tag)`
  background: #ff4d4f;
  color: white;
  border: none;
  margin-left: 8px;
`;

const OffersPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { offers, loading } = useSelector((state: RootState) => state.offers);

  useEffect(() => {
    if (type) {
      dispatch(fetchOffersByType(type));
    }
  }, [dispatch, type]);

  const getOfferTitle = (type: string) => {
    switch (type) {
      case 'under-299':
        return 'Under ₹299';
      case 'special-deals':
        return 'Special Deals';
      case 'deal-of-month':
        return 'Deal of the Month';
      default:
        return 'Special Offers';
    }
  };

  const getOfferDescription = (type: string) => {
    switch (type) {
      case 'under-299':
        return 'Amazing jewelry pieces under ₹299. Perfect for gifting or treating yourself!';
      case 'special-deals':
        return 'Limited time offers on our premium jewelry collection. Don\'t miss out!';
      case 'deal-of-month':
        return 'This month\'s featured deals on our most popular jewelry items.';
      default:
        return 'Discover amazing offers on our jewelry collection.';
    }
  };

  if (loading) {
    return (
      <OffersContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </OffersContainer>
    );
  }

  return (
    <OffersContainer>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1}>
          <FireOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
          {getOfferTitle(type || '')}
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          {getOfferDescription(type || '')}
        </Paragraph>
      </div>

      {offers.length === 0 ? (
        <Empty 
          description="No offers available at the moment"
          style={{ marginTop: '50px' }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {offers.map((offer: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={offer.id}>
              <OfferCard
                hoverable
                cover={<ProductImage src={offer.image_url} alt={offer.title} />}
                actions={[
                  <Button type="primary" size="small" icon={<ShoppingCartOutlined />}>
                    Add to Cart
                  </Button>,
                  <Button size="small">View Details</Button>
                ]}
              >
                <Card.Meta
                  title={
                    <div>
                      {offer.title}
                      {offer.discount > 0 && (
                        <DiscountTag>{offer.discount}% OFF</DiscountTag>
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph style={{ marginBottom: '8px' }}>
                        {offer.description}
                      </Paragraph>
                      <Price>
                        {offer.original_price > offer.price && (
                          <OriginalPrice>₹{offer.original_price}</OriginalPrice>
                        )}
                        ₹{offer.price}
                      </Price>
                      {offer.valid_until && (
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary">
                            Valid until: {new Date(offer.valid_until).toLocaleDateString()}
                          </Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </OfferCard>
            </Col>
          ))}
        </Row>
      )}
    </OffersContainer>
  );
};

export default OffersPage;
