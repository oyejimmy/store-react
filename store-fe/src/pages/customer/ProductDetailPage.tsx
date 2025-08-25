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
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
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

  const discountedPrice = currentProduct.price;

  const images =
    currentProduct.images.length > 0
      ? currentProduct.images
      : ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"];

  return (
    <ProductDetailContainer>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Carousel autoplay>
            {images.map((image, index) => (
              <div key={index}>
                <ProductImage src={image} alt={currentProduct.name} />
              </div>
            ))}
          </Carousel>

          <div style={{ marginTop: "16px" }}>
            <Row gutter={8}>
              {images.map((image, index) => (
                <Col span={6} key={index}>
                  <img
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        selectedImage === index
                          ? "2px solid #d4af37"
                          : "1px solid #d9d9d9",
                    }}
                    onClick={() => setSelectedImage(index)}
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
            {currentProduct.original_price > currentProduct.price && (
              <DiscountTag>
                {Math.round(
                  ((currentProduct.original_price - currentProduct.price) /
                    currentProduct.original_price) *
                    100
                )}
                % OFF
              </DiscountTag>
            )}
          </Space>

          <PriceSection>
            {currentProduct.original_price > currentProduct.price && (
              <OriginalPrice>₹{currentProduct.original_price}</OriginalPrice>
            )}
            <DiscountedPrice>₹{discountedPrice}</DiscountedPrice>
          </PriceSection>

          <Paragraph>{currentProduct.description}</Paragraph>

          <Divider />

          <div style={{ marginBottom: "16px" }}>
            <Text strong>Quantity:</Text>
            <InputNumber
              min={1}
              max={currentProduct.stock_quantity}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
              style={{ marginLeft: "12px", width: "100px" }}
            />
            <Text type="secondary" style={{ marginLeft: "8px" }}>
              {currentProduct.stock_quantity} available
            </Text>
          </div>

          <ActionButtons>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={currentProduct.stock_quantity === 0}
            >
              Add to Cart
            </Button>

            <Button
              size="large"
              onClick={handleBuyNow}
              disabled={currentProduct.stock_quantity === 0}
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
