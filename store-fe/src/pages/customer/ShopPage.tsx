import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchProducts, fetchProductsByCategory, setFilters } from '../../store/slices/productSlice';
import { Card, Row, Col, Select, Input, Button, Pagination, Empty, Spin } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, filters } = useSelector((state: RootState) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (category) {
      dispatch(fetchProductsByCategory({ category }));
    } else {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, category]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setFilters({ ...filters, search: value }));
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    dispatch(setFilters({ ...filters, sortBy: value }));
  };

  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
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
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </ShopContainer>
    );
  }

  return (
    <ShopContainer>
      <h1>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}</h1>
      
      <FilterSection>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search products..."
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={sortBy}
              onChange={handleSort}
              style={{ width: '100%' }}
            >
              <Option value="name">Sort by Name</Option>
              <Option value="price_low">Price: Low to High</Option>
              <Option value="price_high">Price: High to Low</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button icon={<FilterOutlined />} style={{ width: '100%' }}>
              Filters
            </Button>
          </Col>
        </Row>
      </FilterSection>

      {paginatedProducts.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {paginatedProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <ProductCard
                  hoverable
                  cover={<ProductImage src={product.images[0] || ''} alt={product.name} />}
                  actions={[
                    <Button type="primary" size="small">
                      Add to Cart
                    </Button>,
                    <Button size="small">View Details</Button>
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <p>{product.description.substring(0, 60)}...</p>
                        <Price>
                          {product.original_price > product.price && (
                            <OriginalPrice>₹{product.original_price}</OriginalPrice>
                          )}
                          ₹{product.price}
                        </Price>
                      </div>
                    }
                  />
                </ProductCard>
              </Col>
            ))}
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
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
    </ShopContainer>
  );
};

export default ShopPage;
