import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchProducts,
  fetchProductsByCategory,
  setFilters,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Button,
  Pagination,
  Empty,
  Spin,
  message,
  Tag,
  Checkbox,
  Slider,
  Divider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";


const { Option } = Select;
const { Search } = Input;

const ShopContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProductCard = styled(Card)`
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(212, 175, 55, 0.2);
  }

  .ant-card-actions {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    display: flex;
    justify-content: center;
    padding: 8px;
    gap: 8px;

    > li {
      flex: 1;
      margin: 0 !important;
      
      .ant-btn {
        border-radius: 4px;
        font-weight: 500;
        font-size: 11px;
        width: 100%;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;

        .anticon {
          font-size: 10px;
          margin-right: 3px;
        }

        &.ant-btn-primary {
          background: linear-gradient(135deg, #d4af37, #b8860b);
          border: none;

          &:hover {
            background: linear-gradient(135deg, #b8860b, #d4af37);
            transform: translateY(-1px);
          }
        }
      }
    }
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

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, filters } = useSelector(
    (state: RootState) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 799]);

  useEffect(() => {
    const categoryParam = searchParams.get("category") || category;
    if (categoryParam) {
      dispatch(fetchProductsByCategory({ category: categoryParam }));
    } else {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, category, searchParams.get("category")]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
    message.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  const resetFilters = () => {
    setAvailabilityFilter([]);
    setPriceRange([0, 799]);
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const productPrice = product.offer_price || product.price || product.retail_price || 0;
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    
    const isInStock = (product.stock_quantity || product.stock || 0) > 0;
    const matchesAvailability = availabilityFilter.length === 0 || 
      (availabilityFilter.includes('in_stock') && isInStock) ||
      (availabilityFilter.includes('out_of_stock') && !isInStock);
    
    return matchesSearch && matchesPrice && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        const priceA = a.offer_price || a.price || a.retail_price || 0;
        const priceB = b.offer_price || b.price || b.retail_price || 0;
        return priceA - priceB;
      case "price_high":
        const priceA2 = a.offer_price || a.price || a.retail_price || 0;
        const priceB2 = b.offer_price || b.price || b.retail_price || 0;
        return priceB2 - priceA2;
      case "alphabetical_az":
        return a.name.localeCompare(b.name);
      case "alphabetical_za":
        return b.name.localeCompare(a.name);
      case "best_selling":
        return (b.sold || 0) - (a.sold || 0);
      case "featured":
      default:
        return 0;
    }
  });

  const pageSize = 12;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <ShopContainer>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </ShopContainer>
    );
  }

  const categoryParam = searchParams.get("category") || category;
  const pageTitle = categoryParam
    ? categoryParam.charAt(0).toUpperCase() +
      categoryParam.slice(1).replace("-", " ")
    : "All Products";

  return (
    <ShopContainer>
      <h1
        style={{
          textAlign: "center",
          color: "#d4af37",
          fontSize: "48px",
          marginBottom: "40px",
        }}
      >
        {pageTitle}
      </h1>

      <Row gutter={24}>
        <Col xs={24} md={6}>
          <FilterSection>
            <h4 style={{ color: '#d4af37', marginBottom: '16px' }}>Filter:</h4>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600' }}>Availability</span>
                <Button type="link" size="small" onClick={resetFilters}>Reset</Button>
              </div>
              <Checkbox.Group value={availabilityFilter} onChange={setAvailabilityFilter}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Checkbox value="in_stock">
                    In stock ({products.filter(p => (p.stock_quantity || p.stock || 0) > 0).length})
                  </Checkbox>
                  <Checkbox value="out_of_stock">
                    Out of stock ({products.filter(p => (p.stock_quantity || p.stock || 0) === 0).length})
                  </Checkbox>
                </div>
              </Checkbox.Group>
            </div>
            
            <Divider />
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600' }}>Price</span>
                <Button type="link" size="small" onClick={() => setPriceRange([0, 799])}>Reset</Button>
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>The highest price is PKR 799.00</p>
              <Slider
                range
                min={0}
                max={799}
                value={priceRange}
                onChange={(value: number | number[]) => setPriceRange(value as [number, number])}
                tooltip={{ formatter: (value) => `PKR ${value}` }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <Input
                  prefix="PKR"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  placeholder="From"
                  size="small"
                />
                <Input
                  prefix="PKR"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 799])}
                  placeholder="To"
                  size="small"
                />
              </div>
            </div>
          </FilterSection>
        </Col>
        
        <Col xs={24} md={18}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Select
              value={sortBy}
              onChange={handleSort}
              style={{ width: '300px' }}
              placeholder="Sort by"
            >
              <Option value="featured">Featured</Option>
              <Option value="alphabetical_az">Alphabetically, A-Z</Option>
              <Option value="alphabetical_za">Alphabetically, Z-A</Option>
              <Option value="price_low">Price, low to high</Option>
              <Option value="price_high">Price, high to low</Option>
              <Option value="best_selling">Best selling</Option>
            </Select>
            <span style={{ color: '#666' }}>{sortedProducts.length} products</span>
          </div>

          {paginatedProducts.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
            {paginatedProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard
                  hoverable
                  cover={
                    <ProductImage
                      src={product.images[0] || ""}
                      alt={product.name}
                    />
                  }
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        (product.stock_quantity || product.stock || 0) === 0
                      }
                    >
                      Add to Cart
                    </Button>,
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetails(product.id)}
                    >
                      View Details
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <p style={{ marginBottom: "8px", color: "#666" }}>
                          {product.description?.substring(0, 60)}...
                        </p>
                        <div style={{ marginBottom: "8px" }}>
                          <Tag color="gold">
                            {product.category || "Jewelry"}
                          </Tag>
                          {(product.stock_quantity || product.stock || 0) ===
                            0 && <Tag color="red">Out of Stock</Tag>}
                        </div>
                        <Price>
                          {(() => {
                            const originalPrice =
                              product.original_price || product.retail_price;
                            const currentPrice =
                              product.offer_price ||
                              product.price ||
                              product.retail_price;
                            return (
                              originalPrice &&
                              currentPrice &&
                              originalPrice > currentPrice && (
                                <OriginalPrice>PKR {originalPrice}</OriginalPrice>
                              )
                            );
                          })()}
                          PKR {product.offer_price ||
                            product.price ||
                            product.retail_price}
                        </Price>
                      </div>
                    }
                  />
                </ProductCard>
              </Col>
            ))}
          </Row>

              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <Pagination
                  current={currentPage}
                  total={sortedProducts.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </ShopContainer>
  );
};

export default ShopPage;
