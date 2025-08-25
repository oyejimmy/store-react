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
  padding: 24px;
`;

const BannerSection = styled.div`
  margin-bottom: 48px;
`;

const BannerSlide = styled.div<{ bgImage: string }>`
  height: 400px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 32px !important;
  color: #333;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 3px;
    background: #d4af37;
    margin: 16px auto 0;
  }
`;

const ProductCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .ant-card-cover img {
    height: 200px;
    object-fit: cover;
  }
`;

const CategoryCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .ant-card-cover {
    height: 120px;
    background: linear-gradient(135deg, #d4af37, #b8860b);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 48px;
  }
`;

const OfferCard = styled(Card)`
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: white;
  text-align: center;

  .ant-card-body {
    padding: 24px;
  }
`;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector(
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
      title: "Special Offers Under ₹299",
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
    { name: "Rings", icon: "💍", link: "/shop/rings" },
    { name: "Earrings", icon: "👂", link: "/shop/earrings" },
    { name: "Bangles", icon: "💫", link: "/shop/bangles" },
    { name: "Anklets", icon: "🦶", link: "/shop/anklets" },
    { name: "Bracelets", icon: "💎", link: "/shop/bracelets" },
    { name: "Pendants", icon: "✨", link: "/shop/pendants" },
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
                  <Title level={1} style={{ color: "white", marginBottom: 16 }}>
                    {slide.title}
                  </Title>
                  <Paragraph
                    style={{ color: "white", fontSize: 18, marginBottom: 24 }}
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
      <section style={{ marginBottom: 48 }}>
        <SectionTitle level={2}>Shop by Category</SectionTitle>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={12} sm={8} md={4} key={category.name}>
              <Link to={category.link}>
                <CategoryCard>
                  <div style={{ fontSize: 48 }}>{category.icon}</div>
                  <Title level={4} style={{ marginTop: 16 }}>
                    {category.name}
                  </Title>
                </CategoryCard>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: 48 }}>
        <SectionTitle level={2}>Featured Products</SectionTitle>
        <Row gutter={[16, 16]}>
          {products.slice(0, 8).map((product) => (
            <Col xs={24} sm={12} md={6} key={product.id}>
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
                    <Button type="primary" size="small">
                      View Details
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: "bold",
                              color: "#D4AF37",
                            }}
                          >
                            ₹{product.price}
                          </span>
                          {product.original_price > product.price && (
                            <span
                              style={{
                                textDecoration: "line-through",
                                marginLeft: 8,
                                color: "#999",
                              }}
                            >
                              ₹{product.original_price}
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
      </section>

      {/* Special Offers */}
      <section style={{ marginBottom: 48 }}>
        <SectionTitle level={2}>Special Offers</SectionTitle>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Link to="/offers/under-299">
              <OfferCard>
                <Title level={3} style={{ color: "white" }}>
                  Under ₹299
                </Title>
                <Paragraph style={{ color: "white" }}>
                  Beautiful jewelry pieces at unbeatable prices
                </Paragraph>
                <Button type="default" size="large">
                  Shop Now
                </Button>
              </OfferCard>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to="/offers/special-deals">
              <OfferCard>
                <Title level={3} style={{ color: "white" }}>
                  Special Deals
                </Title>
                <Paragraph style={{ color: "white" }}>
                  Limited time offers on premium collections
                </Paragraph>
                <Button type="default" size="large">
                  View Deals
                </Button>
              </OfferCard>
            </Link>
          </Col>
          <Col xs={24} md={8}>
            <Link to="/offers/deal-of-month">
              <OfferCard>
                <Title level={3} style={{ color: "white" }}>
                  Deal of the Month
                </Title>
                <Paragraph style={{ color: "white" }}>
                  Exclusive monthly offers on trending pieces
                </Paragraph>
                <Button type="default" size="large">
                  Explore
                </Button>
              </OfferCard>
            </Link>
          </Col>
        </Row>
      </section>

      {/* Instagram Feed Placeholder */}
      <section>
        <SectionTitle level={2}>Follow Us on Instagram</SectionTitle>
        <Row gutter={[8, 8]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col xs={12} sm={8} md={4} key={index}>
              <div
                style={{
                  height: 200,
                  background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 8,
                }}
              >
                📸
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </HomeContainer>
  );
};

export default HomePage;
