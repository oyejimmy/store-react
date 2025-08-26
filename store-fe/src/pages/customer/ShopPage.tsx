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
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Pagination,
  Typography,
  CircularProgress,
  Chip,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Alert,
  InputAdornment,
  Paper
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart,
  Visibility,
  FilterList
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

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
    alert(`${product.name} added to cart!`);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const categoryParam = searchParams.get("category") || category;
  const pageTitle = categoryParam
    ? categoryParam.charAt(0).toUpperCase() +
      categoryParam.slice(1).replace("-", " ")
    : "All Products";

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          color: theme.palette.primary.main,
          mb: 5,
          fontWeight: 'bold'
        }}
      >
        {pageTitle}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                Filters
              </Typography>
              <Button size="small" onClick={resetFilters}>
                Reset
              </Button>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Availability
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availabilityFilter.includes('in_stock')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAvailabilityFilter([...availabilityFilter, 'in_stock']);
                      } else {
                        setAvailabilityFilter(availabilityFilter.filter(f => f !== 'in_stock'));
                      }
                    }}
                  />
                }
                label={`In stock (${products.filter(p => (p.stock_quantity || p.stock || 0) > 0).length})`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={availabilityFilter.includes('out_of_stock')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAvailabilityFilter([...availabilityFilter, 'out_of_stock']);
                      } else {
                        setAvailabilityFilter(availabilityFilter.filter(f => f !== 'out_of_stock'));
                      }
                    }}
                  />
                }
                label={`Out of stock (${products.filter(p => (p.stock_quantity || p.stock || 0) === 0).length})`}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Price Range
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                The highest price is PKR 799.00
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, value) => setPriceRange(value as [number, number])}
                valueLabelDisplay="auto"
                min={0}
                max={799}
                valueLabelFormat={(value) => `PKR ${value}`}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    label="From"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size="small"
                    label="To"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 799])}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">PKR</InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="alphabetical_az">Alphabetically, A-Z</MenuItem>
                <MenuItem value="alphabetical_za">Alphabetically, Z-A</MenuItem>
                <MenuItem value="price_low">Price, low to high</MenuItem>
                <MenuItem value="price_high">Price, high to low</MenuItem>
                <MenuItem value="best_selling">Best selling</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {sortedProducts.length} products
            </Typography>
          </Box>

          {paginatedProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={2}>
                {paginatedProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images[0] || ""}
                        alt={product.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.description?.substring(0, 60)}...
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Chip label={product.category || "Jewelry"} size="small" color="primary" />
                          {(product.stock_quantity || product.stock || 0) === 0 && (
                            <Chip label="Out of Stock" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Box>
                        <Box>
                          {(() => {
                            const originalPrice = product.original_price || product.retail_price;
                            const currentPrice = product.offer_price || product.price || product.retail_price;
                            return (
                              originalPrice && currentPrice && originalPrice > currentPrice && (
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}
                                  component="span"
                                >
                                  PKR {originalPrice}
                                </Typography>
                              )
                            );
                          })()}
                          <Typography
                            variant="h6"
                            sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
                            component="span"
                          >
                            PKR {product.offer_price || product.price || product.retail_price}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 1 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleAddToCart(product)}
                          disabled={(product.stock_quantity || product.stock || 0) === 0}
                          sx={{ flex: 1, mr: 1 }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(product.id)}
                          sx={{ flex: 1 }}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={Math.ceil(sortedProducts.length / pageSize)}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShopPage;