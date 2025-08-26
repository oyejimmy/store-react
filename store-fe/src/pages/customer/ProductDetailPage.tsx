import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchProductById } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  Card,
  Row,
  Col,
  Button,
  InputNumber,
  Typography,
  Tag,
  Divider,
  Carousel,
  message,
  Spin,
  Space,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styled from "styled-components";


const { Title, Text, Paragraph } = Typography;

const ProductDetailContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const PriceSection = styled.div`
  margin: 16px 0;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 16px;
  margin-right: 12px;
`;

const DiscountedPrice = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: #d4af37;
`;

const DiscountTag = styled(Tag)`
  background: #ff4d4f;
  color: white;
  border: none;
  margin-left: 8px;
`;

const ActionButtons = styled.div`
  margin: 24px 0;

  .ant-btn {
    margin-right: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    font-weight: 600;
    
    &.ant-btn-primary {
      background: linear-gradient(135deg, #d4af37, #b8860b);
      border: none;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #b8860b, #d4af37);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
      }
    }
    
    &:not(.ant-btn-primary) {
      border: 2px solid #d4af37;
      color: #d4af37;
      
      &:hover {
        background: #d4af37;
        color: white;
        transform: translateY(-2px);
      }
    }
  }
`;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { items } = useSelector((state: RootState) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(
        addToCart({
          product: currentProduct,
          quantity,
        })
      );
      message.success("Product added to cart!");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProduct?.name,
        text: currentProduct?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Link copied to clipboard!");
    }
  };

  if (loading || !currentProduct) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </ProductDetailContainer>
    );
  }

  const discountedPrice = currentProduct.offer_price || currentProduct.price || currentProduct.retail_price;

  const defaultImages = [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500"
  ];
  
  const images = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : defaultImages;

  return (
    <ProductDetailContainer>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div style={{ marginBottom: '16px' }}>
            <ProductImage 
              src={images[selectedImage]} 
              alt={currentProduct.name} 
            />
          </div>

          <div>
            <Row gutter={[8, 8]}>
              {images.slice(0, 5).map((image, index) => (
                <Col span={4} key={index}>
                  <img
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border: selectedImage === index
                        ? "3px solid #d4af37"
                        : "2px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      boxShadow: selectedImage === index 
                        ? "0 4px 12px rgba(212, 175, 55, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={(e) => {
                      if (selectedImage !== index) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Title level={2}>{currentProduct.name}</Title>

          <Space style={{ marginBottom: "16px" }}>
            <Tag color="gold">Premium Quality</Tag>
            {(() => {
              const originalPrice = currentProduct.original_price || currentProduct.retail_price;
              const currentPrice = currentProduct.offer_price || currentProduct.price || currentProduct.retail_price;
              return originalPrice && currentPrice && originalPrice > currentPrice && (
                <DiscountTag>
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}
                  % OFF
                </DiscountTag>
              );
            })()}
          </Space>

          <PriceSection>
            {(() => {
              const originalPrice = currentProduct.original_price || currentProduct.retail_price;
              const currentPrice = currentProduct.offer_price || currentProduct.price || currentProduct.retail_price;
              return originalPrice && currentPrice && originalPrice > currentPrice && (
                <OriginalPrice>PKR {originalPrice}</OriginalPrice>
              );
            })()}
            <DiscountedPrice>PKR {currentProduct.offer_price || currentProduct.price || currentProduct.retail_price}</DiscountedPrice>
          </PriceSection>

          <Paragraph>{currentProduct.description}</Paragraph>

          <Divider />

          <div style={{ marginBottom: "16px" }}>
            <Text strong>Quantity:</Text>
            <InputNumber
              min={1}
              max={currentProduct.stock_quantity || currentProduct.stock || 0}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              style={{ marginLeft: "12px", width: "100px" }}
            />
            <Text type="secondary" style={{ marginLeft: "8px" }}>
              {currentProduct.stock_quantity || currentProduct.stock || 0} available
            </Text>
          </div>

          <ActionButtons>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={(currentProduct.stock_quantity || currentProduct.stock || 0) === 0}
            >
              Add to Cart
            </Button>

            <Button
              size="large"
              onClick={handleBuyNow}
              disabled={(currentProduct.stock_quantity || currentProduct.stock || 0) === 0}
            >
              Buy Now
            </Button>

            <Button size="large" icon={<HeartOutlined />}>
              Wishlist
            </Button>

            <Button
              size="large"
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            >
              Share
            </Button>
          </ActionButtons>

          <Divider />

          <div>
            <Title level={4}>Product Details</Title>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Text strong>Category:</Text>
              </Col>
              <Col span={12}>
                <Text>{currentProduct.category}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Subcategory:</Text>
              </Col>
              <Col span={12}>
                <Text>{currentProduct.subcategory}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Material:</Text>
              </Col>
              <Col span={12}>
                <Text>Gold Plated</Text>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;
