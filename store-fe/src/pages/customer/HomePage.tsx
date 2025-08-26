import React, { useEffect } from "react";
import { Carousel, Row, Col, Card, Button, Typography, Tag } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchProducts,
} from "../../store/slices/productSlice";
import { fetchOffersByType } from "../../store/slices/offerSlice";
import styled from "styled-components";


const { Title, Paragraph } = Typography;

const HomeContainer = styled.div`
  padding: 0;
  min-height: 100vh;
  transition: all 0.3s ease;
  
  .dark-theme & {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
    color: #ffffff;
  }
  
  .light-theme & {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f4 100%);
    color: #333;
  }
`;

const BannerSection = styled.div`
  margin-bottom: 80px;
`;

const BannerSlide = styled.div<{ bgImage: string }>`
  height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 60px !important;
  font-weight: 300;
  font-size: 48px !important;
  letter-spacing: 2px;
  position: relative;
  
  .light-theme & {
    color: #d4af37 !important;
  }
  
  .dark-theme & {
    color: #ffffff !important;
  }
  
  &::after {
    content: "";
    display: block;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    margin: 20px auto 0;
    box-shadow: 0 2px 10px rgba(212, 175, 55, 0.4);
  }
`;

const ProductCard = styled(Card)`
  height: 100%;
  border-radius: 20px;
  transition: all 0.4s ease;
  overflow: hidden;
  
  .dark-theme & {
    background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
    border: 1px solid #333;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    
    .ant-card-body {
      background: transparent;
      color: #fff;
    }
  }
  
  .light-theme & {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border: 1px solid #e8e8e8;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    
    .ant-card-body {
      background: transparent;
      color: #333;
    }
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    
    .dark-theme & {
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
      border-color: #d4af37;
    }
    
    .light-theme & {
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
      border-color: #d4af37;
    }
  }

  .ant-card-cover img {
    height: 280px;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }
  
  .ant-card-meta-title {
    color: #d4af37 !important;
    font-weight: 600;
    font-size: 18px !important;
  }
`;

const CategoryCard = styled.div`
  position: relative;
  height: 320px;
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s ease;
  
  .dark-theme & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: 2px solid #333;
  }
  
  .light-theme & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #e8e8e8;
  }

  &:hover {
    transform: translateY(-15px) scale(1.03);
    
    .dark-theme & {
      box-shadow: 0 25px 50px rgba(212, 175, 55, 0.4);
      border-color: #d4af37;
    }
    
    .light-theme & {
      box-shadow: 0 25px 50px rgba(212, 175, 55, 0.3);
      border-color: #d4af37;
    }
    
    .category-overlay {
      background: linear-gradient(45deg, rgba(212, 175, 55, 0.85), rgba(184, 134, 11, 0.85));
    }
    
    .category-title {
      transform: translateY(-15px) scale(1.1);
      color: #ffffff !important;
    }
  }
`;

const OfferCard = styled(Card)`
  text-align: center;
  border-radius: 25px;
  transition: all 0.5s ease;
  overflow: hidden;
  
  .dark-theme & {
    background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
    border: 2px solid #d4af37;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    .ant-typography {
      color: #ffffff !important;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
    }
  }
  
  .light-theme & {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border: 2px solid #d4af37;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    
    .ant-typography {
      color: #333 !important;
      text-shadow: none !important;
    }
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.03);
    
    .dark-theme & {
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.4);
    }
    
    .light-theme & {
      box-shadow: 0 20px 40px rgba(212, 175, 55, 0.3);
    }
  }

  .ant-card-body {
    padding: 40px 24px;
  }
`;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    // Fetch featured products
    dispatch(fetchProducts({ limit: 8 }));

    // Fetch special offers
    dispatch(fetchOffersByType("under_299"));
    dispatch(fetchOffersByType("special_deals"));
    dispatch(fetchOffersByType("deal_of_month"));
  }, [dispatch]);

  const bannerSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
      title: "Elegant Jewelry Collection",
      subtitle: "Discover our stunning collection of handcrafted jewelry",
      cta: "Shop Now",
      link: "/shop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200",
      title: "Special Offers Under PKR 299",
      subtitle: "Limited time deals on selected jewelry pieces",
      cta: "View Offers",
      link: "/offers/under-299",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200",
      title: "New Arrivals",
      subtitle: "Latest designs in rings, earrings, and more",
      cta: "Explore",
      link: "/shop",
    },
  ];

  const categories = [
    { 
      name: "Rings", 
      icon: "💍", 
      link: "/shop?category=rings",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop"
    },
    { 
      name: "Earrings", 
      icon: "👂", 
      link: "/shop?category=earrings",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=200&fit=crop"
    },
    { 
      name: "Bangles", 
      icon: "💫", 
      link: "/shop?category=bangles",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=200&fit=crop"
    },
    { 
      name: "Anklets", 
      icon: "🦶", 
      link: "/shop?category=anklets",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=300&h=200&fit=crop"
    },
    { 
      name: "Bracelets", 
      icon: "💎", 
      link: "/shop?category=bracelets",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=200&fit=crop"
    },
    { 
      name: "Pendants", 
      icon: "✨", 
      link: "/shop?category=pendants",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop"
    },
  ];



  return (
    <HomeContainer>
      {/* Banner Carousel */}
      <BannerSection>
        <Carousel autoplay effect="fade">
          {bannerSlides.map((slide, index) => (
            <div key={index}>
              <BannerSlide bgImage={slide.image}>
                <div>
                  <Title level={1} style={{ 
                    color: "#ffffff", 
                    marginBottom: 16
                  }}>
                    {slide.title}
                  </Title>
                  <Paragraph
                    style={{ 
                      color: "#ffffff", 
                      fontSize: 18, 
                      marginBottom: 24
                    }}
                  >
                    {slide.subtitle}
                  </Paragraph>
                  <Link to={slide.link}>
                    <Button type="primary" size="large">
                      {slide.cta}
                    </Button>
                  </Link>
                </div>
              </BannerSlide>
            </div>
          ))}
        </Carousel>
      </BannerSection>

      {/* Categories */}
      <section style={{ marginBottom: 100, padding: '80px 40px' }}>
        <SectionTitle level={2} style={{ color: '#d4af37 !important' }}>Shop by Category →</SectionTitle>
        <div style={{ padding: '0 10%' }}>
          <Row gutter={[32, 32]}>
            {categories.slice(0, 6).map((category) => (
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
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
                    transition: 'all 0.4s ease'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px',
                    zIndex: 2
                  }}>
                    <Title className="category-title" level={4} style={{
                      margin: 0,
                      color: '#d4af37',
                      fontWeight: 400,
                      fontSize: '20px',
                      letterSpacing: '1px',
                      transition: 'all 0.4s ease'
                    }}>
                      {category.name} →
                    </Title>
                  </div>
                </CategoryCard>
              </Link>
              </Col>
            ))}
          </Row>
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/categories">
            <Button style={{ 
              background: 'transparent',
              border: '2px solid #d4af37',
              borderRadius: '50px',
              padding: '0 60px',
              height: '60px',
              fontSize: '16px',
              fontWeight: '400',
              color: '#d4af37',
              letterSpacing: '1px',
              transition: 'all 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d4af37';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#d4af37';
            }}>
              EXPLORE COLLECTION
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: 100, padding: '80px 40px' }}>
        <SectionTitle level={2} style={{ color: '#d4af37 !important' }}>Featured Products →</SectionTitle>
        <div style={{ padding: '0 10%' }}>
          <Row gutter={[32, 32]}>
            {products.slice(0, 6).map((product) => (
              <Col xs={24} sm={12} md={8} key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <ProductCard
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={
                          product.images[0] ||
                          "https://via.placeholder.com/300x200?text=Product+Image"
                        }
                      />
                    }
                    actions={[
                      <Button style={{
                        background: 'transparent',
                        border: '1px solid #d4af37',
                        color: '#d4af37',
                        borderRadius: '25px'
                      }}>
                        View Details
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <div>
                          <div style={{ marginBottom: 12 }}>
                            <span style={{
                              fontSize: 20,
                              fontWeight: "600",
                              color: "#d4af37",
                              letterSpacing: '0.5px'
                            }}>
                              PKR {product.offer_price || product.price || product.retail_price}
                            </span>
                            {(product.original_price || product.retail_price) > (product.offer_price || product.price || product.retail_price) && (
                              <span style={{
                                textDecoration: "line-through",
                                marginLeft: 12,
                                color: "#666",
                                fontSize: 16
                              }}>
                                PKR {product.original_price || product.retail_price}
                              </span>
                            )}
                          </div>
                          <Tag color="gold">{product.category}</Tag>
                        </div>
                      }
                    />
                  </ProductCard>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Special Offers */}
      <section style={{ marginBottom: 100, padding: '80px 40px' }}>
        <SectionTitle level={2} style={{ color: '#d4af37 !important' }}>Special Offers</SectionTitle>
        <div style={{ padding: '0 10%' }}>
          <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Link to="/offers/under-299">
              <OfferCard
                cover={
                  <div style={{
                    height: '200px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'
                    }} />
                  </div>
                }
              >
                <Title level={3}>
                  Under PKR 299
                </Title>
                <Paragraph>
                  Beautiful jewelry pieces at unbeatable prices
                </Paragraph>
                <Button size="large" style={{
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}>
                  SHOP NOW ✨
                </Button>
              </OfferCard>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to="/offers/special-deals">
              <OfferCard
                cover={
                  <div style={{
                    height: '200px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'
                    }} />
                  </div>
                }
              >
                <Title level={3}>
                  Special Deals
                </Title>
                <Paragraph>
                  Limited time offers on premium collections
                </Paragraph>
                <Button size="large" style={{
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}>
                  GRAB DEALS 🔥
                </Button>
              </OfferCard>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to="/offers/deal-of-month">
              <OfferCard
                cover={
                  <div style={{
                    height: '200px',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=200&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))'
                    }} />
                  </div>
                }
              >
                <Title level={3}>
                  Deal of the Month
                </Title>
                <Paragraph>
                  Exclusive monthly offers on trending pieces
                </Paragraph>
                <Button size="large" style={{
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}>
                  EXPLORE NOW 💎
                </Button>
              </OfferCard>
            </Link>
          </Col>
          </Row>
        </div>
      </section>

      {/* Instagram Feed */}
      <section style={{ padding: '80px 40px' }}>
        <SectionTitle level={2} style={{ color: '#d4af37 !important' }}>Follow Us on TikTok →</SectionTitle>
        <div style={{ padding: '0 10%' }}>
          <Carousel arrows dots={false} slidesToShow={7} slidesToScroll={1} autoplay>
            {[
              'https://www.tiktok.com/@jewelry_store/video/1',
              'https://www.tiktok.com/@jewelry_store/video/2',
              'https://www.tiktok.com/@jewelry_store/video/3',
              'https://www.tiktok.com/@jewelry_store/video/4',
              'https://www.tiktok.com/@jewelry_store/video/5',
              'https://www.tiktok.com/@jewelry_store/video/6'
            ].map((videoUrl, index) => (
              <div key={index} style={{ padding: '0 5px' }}>
                <div style={{
                  height: 500,
                  width: 200,
                  margin: '0 auto',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                  background: '#000',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: `url(https://picsum.photos/200/500?random=${index}) center/cover`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#ff0050',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }}>
                      ▶
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    color: 'white',
                    fontSize: 12,
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '4px 8px',
                    borderRadius: 8
                  }}>
                    @jewelry_store
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </HomeContainer>
  );
};

export default HomePage;
