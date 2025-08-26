import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const { Title } = Typography;

const CategoriesContainer = styled.div`
  padding: 100px 40px 60px;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CategoryCard = styled.div`
  position: relative;
  height: 280px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
    
    .category-overlay {
      background: linear-gradient(45deg, rgba(212, 175, 55, 0.85), rgba(184, 134, 11, 0.85));
    }
    
    .category-arrow {
      transform: translateX(8px);
    }
  }
`;

const CategoriesPage: React.FC = () => {
  const categories = [
    { name: 'Anklets', link: '/shop?category=anklets', image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=300&fit=crop' },
    { name: 'Bangles', link: '/shop?category=bangles', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop' },
    { name: 'Bracelets', link: '/shop?category=bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop' },
    { name: 'Combos', link: '/shop?category=combos', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop' },
    { name: 'Ear Studs', link: '/shop?category=ear-studs', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop' },
    { name: 'Earrings', link: '/shop?category=earrings', image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=300&fit=crop' },
    { name: 'Hoops', link: '/shop?category=hoops', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop' },
    { name: 'Pendants', link: '/shop?category=pendants', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop' },
    { name: 'Rings', link: '/shop?category=rings', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop' },
    { name: 'Wall Frame Design', link: '/shop?category=wall-frames', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' },
    { name: 'Under 299', link: '/offers/under-299', image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop' },
    { name: 'Special Deals', link: '/offers/special-deals', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop' },
    { name: 'Deal of the Month', link: '/offers/deal-of-month', image: 'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=300&fit=crop' },
  ];

  return (
    <CategoriesContainer>
      <Title level={1} style={{ textAlign: 'center', color: '#d4af37', marginBottom: '60px' }}>
        All Collections
      </Title>
      
      <Row gutter={[32, 32]} justify="center">
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} key={category.name}>
            <Link to={category.link}>
              <CategoryCard>
                <img
                  alt={category.name}
                  src={category.image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
                <div className="category-overlay" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))',
                  transition: 'all 0.4s ease'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  zIndex: 2
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Title level={4} style={{
                      margin: 0,
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '18px',
                      letterSpacing: '0.5px'
                    }}>
                      {category.name}
                    </Title>
                    <div className="category-arrow" style={{
                      color: '#d4af37',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      transition: 'transform 0.3s ease'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              </CategoryCard>
            </Link>
          </Col>
        ))}
      </Row>
    </CategoriesContainer>
  );
};

export default CategoriesPage;